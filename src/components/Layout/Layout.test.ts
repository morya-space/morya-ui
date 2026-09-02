import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { h, nextTick } from "vue";
import WiLayout from "./Layout.vue";
import WiLayoutContent from "./LayoutContent.vue";
import WiLayoutFooter from "./LayoutFooter.vue";
import WiLayoutHeader from "./LayoutHeader.vue";
import WiLayoutSider from "./LayoutSider.vue";

describe("wiLayout", () => {
  it("renders header content footer structure", () => {
    const wrapper = mount(WiLayout, {
      slots: {
        default: () => [
          h(WiLayoutHeader, null, () => "Header"),
          h(WiLayoutContent, null, () => "Body"),
          h(WiLayoutFooter, null, () => "Footer"),
        ],
      },
    });
    expect(wrapper.find(".wi-layout-header").text()).toBe("Header");
    expect(wrapper.find(".wi-layout-content").text()).toBe("Body");
    expect(wrapper.find(".wi-layout-footer").text()).toBe("Footer");
  });

  it("enables has-sider row layout", () => {
    const wrapper = mount(WiLayout, {
      props: { hasSider: true },
      slots: {
        default: () => [
          h(WiLayoutSider, null, () => "Sider"),
          h(WiLayoutContent, null, () => "Main"),
        ],
      },
    });
    expect(wrapper.classes()).toContain("wi-layout--has-sider");
    expect(wrapper.find(".wi-layout__scroll--has-sider").exists()).toBe(true);
    expect(wrapper.find(".wi-layout-sider").classes()).toContain(
      "wi-layout-sider--left-placement",
    );
  });

  it("keeps scroll container at full height", () => {
    const wrapper = mount(WiLayout, {
      attrs: { style: "height: 200px" },
      slots: {
        default: () => [
          h(WiLayoutHeader, null, () => "Header"),
          h(WiLayoutContent, null, () => "Body"),
        ],
      },
    });
    expect(wrapper.classes()).toContain("wi-layout--static-positioned");
    expect(wrapper.find(".wi-layout__scroll").exists()).toBe(true);
  });

  it("shows the header bottom border by default and supports disabling it", () => {
    expect(mount(WiLayoutHeader).classes()).toContain(
      "wi-layout-header--bordered",
    );
    expect(
      mount(WiLayoutHeader, { props: { bordered: false } }).classes(),
    ).not.toContain("wi-layout-header--bordered");
  });

  it("applies layout dimension props", () => {
    const wrapper = mount(WiLayout, {
      props: { height: 400, width: "80%" },
      slots: {
        default: () =>
          h(
            WiLayoutHeader,
            { height: 64, padding: 12, radius: 8 },
            () => "Header",
          ),
      },
    });
    expect(wrapper.element.style.height).toBe("400px");
    expect(wrapper.element.style.width).toBe("80%");
    const header = wrapper.find<HTMLElement>(".wi-layout-header");
    expect(header.element.style.height).toBe("64px");
    expect(header.element.style.padding).toBe("12px");
    expect(header.element.style.borderRadius).toBe("8px");
  });

  it("uses CSS percentage height by default", () => {
    const wrapper = mount(WiLayout);
    expect(wrapper.element.style.height).toBe("");
    expect(wrapper.classes()).toContain("wi-layout");
  });

  it("does not self-reference sider width tokens by default", () => {
    const wrapper = mount(WiLayoutSider);
    expect(wrapper.element.style.getPropertyValue("--wi-layout-sider-width")).toBe(
      "",
    );
    expect(
      wrapper.element.style.getPropertyValue("--wi-layout-sider-collapsed-width"),
    ).toBe("");
    expect(wrapper.element.style.width).toBe("var(--wi-layout-sider-width)");
    expect(wrapper.element.style.maxWidth).toBe("var(--wi-layout-sider-width)");
  });

  it("does not write self-referencing var() props to sider width tokens", () => {
    const wrapper = mount(WiLayoutSider, {
      props: {
        width: "var(--wi-layout-sider-width)",
        collapsedWidth: "var(--wi-layout-sider-collapsed-width)",
      },
    });
    expect(wrapper.element.style.getPropertyValue("--wi-layout-sider-width")).toBe(
      "",
    );
    expect(
      wrapper.element.style.getPropertyValue("--wi-layout-sider-collapsed-width"),
    ).toBe("");
    expect(wrapper.element.style.width).toBe("var(--wi-layout-sider-width)");
  });

  it("uses the sider width only on the root element", () => {
    const wrapper = mount(WiLayoutSider, {
      props: { width: 240, collapsedWidth: 56, padding: 16, radius: 4 },
    });
    const content = wrapper.find<HTMLElement>(".wi-layout-sider__scroll");
    expect(wrapper.element.style.width).toBe("240px");
    expect(wrapper.element.style.maxWidth).toBe("240px");
    expect(wrapper.element.style.getPropertyValue("--wi-layout-sider-width")).toBe(
      "240px",
    );
    expect(wrapper.element.style.padding).toBe("");
    expect(wrapper.element.style.borderRadius).toBe("4px");
    expect(content.element.style.padding).toBe("16px");
    expect(content.element.style.width).toBe("");
    expect(content.element.style.minWidth).toBe("");
  });

  it("toggles sider collapsed state via max-width in transform mode", async () => {
    const wrapper = mount(WiLayoutSider, {
      props: {
        showTrigger: "arrow-circle",
        width: 200,
        collapsedWidth: 48,
        padding: 16,
        collapsed: false,
        "onUpdate:collapsed": (value: boolean) => {
          void wrapper.setProps({ collapsed: value });
        },
      },
    });
    expect(wrapper.element.style.width).toBe("200px");
    expect(wrapper.element.style.maxWidth).toBe("200px");
    await wrapper.get(".wi-layout-sider__trigger").trigger("click");
    await nextTick();
    expect(wrapper.emitted("update:collapsed")?.[0]).toEqual([true]);
    expect(wrapper.classes()).toContain("wi-layout-sider--collapsed");
    expect(wrapper.element.style.width).toBe("200px");
    expect(wrapper.element.style.maxWidth).toBe("48px");
    expect(wrapper.find(".wi-layout-sider__scroll").element.style.padding).toBe(
      "16px",
    );
  });

  it("shrinks sider width in width collapse mode", async () => {
    const wrapper = mount(WiLayoutSider, {
      props: {
        collapseMode: "width",
        showTrigger: "arrow-circle",
        width: 200,
        collapsedWidth: 0,
        padding: 16,
        collapsed: false,
        "onUpdate:collapsed": (value: boolean) => {
          void wrapper.setProps({ collapsed: value });
        },
      },
    });
    await wrapper.get(".wi-layout-sider__trigger").trigger("click");
    await nextTick();
    expect(wrapper.element.style.width).toBe("0px");
    expect(wrapper.element.style.maxWidth).toBe("0px");
  });

  it("supports sider-placement right", async () => {
    const wrapper = mount(WiLayout, {
      props: { hasSider: true, siderPlacement: "right" },
      slots: {
        default: () => [
          h(WiLayoutSider, null, () => "Sider"),
          h(WiLayoutContent, null, () => "Main"),
        ],
      },
    });
    expect(wrapper.find(".wi-layout-sider").classes()).toContain(
      "wi-layout-sider--right-placement",
    );
  });

  it("always uses the native scroll container", () => {
    const wrapper = mount(WiLayout, {
      slots: {
        default: () => [
          h(WiLayoutHeader, null, () => "Header"),
          h(WiLayoutContent, null, () => "Body"),
        ],
      },
    });
    expect(wrapper.find(".wi-layout__scroll").exists()).toBe(true);
    expect(wrapper.find(".wi-layout__scrollbar").exists()).toBe(false);
    expect(wrapper.find(".wi-scrollbar").exists()).toBe(false);
  });
});
