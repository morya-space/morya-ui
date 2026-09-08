import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { h, nextTick } from "vue";
import WkLayout from "./Layout.vue";
import WkLayoutContent from "./LayoutContent.vue";
import WkLayoutFooter from "./LayoutFooter.vue";
import WkLayoutHeader from "./LayoutHeader.vue";
import WkLayoutSider from "./LayoutSider.vue";

describe('wkLayout', () => {
  it("renders header content footer structure", () => {
    const wrapper = mount(WkLayout, {
      slots: {
        default: () => [
          h(WkLayoutHeader, null, () => "Header"),
          h(WkLayoutContent, null, () => "Body"),
          h(WkLayoutFooter, null, () => "Footer"),
        ],
      },
    });
    expect(wrapper.find(".wk-layout-header").text()).toBe("Header");
    expect(wrapper.find(".wk-layout-content").text()).toBe("Body");
    expect(wrapper.find(".wk-layout-footer").text()).toBe("Footer");
  });

  it("enables has-sider row layout", () => {
    const wrapper = mount(WkLayout, {
      props: { hasSider: true },
      slots: {
        default: () => [
          h(WkLayoutSider, null, () => "Sider"),
          h(WkLayoutContent, null, () => "Main"),
        ],
      },
    });
    expect(wrapper.classes()).toContain("wk-layout--has-sider");
    expect(wrapper.find(".wk-layout__scroll--has-sider").exists()).toBe(true);
    expect(wrapper.find(".wk-layout-sider").classes()).toContain(
      "wk-layout-sider--left-placement",
    );
  });

  it("keeps scroll container at full height", () => {
    const wrapper = mount(WkLayout, {
      attrs: { style: "height: 200px" },
      slots: {
        default: () => [
          h(WkLayoutHeader, null, () => "Header"),
          h(WkLayoutContent, null, () => "Body"),
        ],
      },
    });
    expect(wrapper.classes()).toContain("wk-layout--static-positioned");
    expect(wrapper.find(".wk-layout__scroll").exists()).toBe(true);
  });

  it("shows the header bottom border by default and supports disabling it", () => {
    expect(mount(WkLayoutHeader).classes()).toContain(
      "wk-layout-header--bordered",
    );
    expect(
      mount(WkLayoutHeader, { props: { bordered: false } }).classes(),
    ).not.toContain("wk-layout-header--bordered");
  });

  it("applies layout dimension props", () => {
    const wrapper = mount(WkLayout, {
      props: { height: 400, width: "80%" },
      slots: {
        default: () =>
          h(
            WkLayoutHeader,
            { height: 64, padding: 12, radius: 8 },
            () => "Header",
          ),
      },
    });
    expect(wrapper.element.style.height).toBe("400px");
    expect(wrapper.element.style.width).toBe("80%");
    const header = wrapper.find<HTMLElement>(".wk-layout-header");
    expect(header.element.style.height).toBe("64px");
    expect(header.element.style.padding).toBe("12px");
    expect(header.element.style.borderRadius).toBe("8px");
  });

  it("uses CSS percentage height by default", () => {
    const wrapper = mount(WkLayout);
    expect(wrapper.element.style.height).toBe("");
    expect(wrapper.classes()).toContain("wk-layout");
  });

  it("does not self-reference sider width tokens by default", () => {
    const wrapper = mount(WkLayoutSider);
    expect(wrapper.element.style.getPropertyValue("--wk-layout-sider-width")).toBe(
      "",
    );
    expect(
      wrapper.element.style.getPropertyValue("--wk-layout-sider-collapsed-width"),
    ).toBe("");
    expect(wrapper.element.style.width).toBe("var(--wk-layout-sider-width)");
    expect(wrapper.element.style.maxWidth).toBe("var(--wk-layout-sider-width)");
  });

  it("does not write self-referencing var() props to sider width tokens", () => {
    const wrapper = mount(WkLayoutSider, {
      props: {
        width: "var(--wk-layout-sider-width)",
        collapsedWidth: "var(--wk-layout-sider-collapsed-width)",
      },
    });
    expect(wrapper.element.style.getPropertyValue("--wk-layout-sider-width")).toBe(
      "",
    );
    expect(
      wrapper.element.style.getPropertyValue("--wk-layout-sider-collapsed-width"),
    ).toBe("");
    expect(wrapper.element.style.width).toBe("var(--wk-layout-sider-width)");
  });

  it("uses the sider width only on the root element", () => {
    const wrapper = mount(WkLayoutSider, {
      props: { width: 240, collapsedWidth: 56, padding: 16, radius: 4 },
    });
    const content = wrapper.find<HTMLElement>(".wk-layout-sider__scroll");
    expect(wrapper.element.style.width).toBe("240px");
    expect(wrapper.element.style.maxWidth).toBe("240px");
    expect(wrapper.element.style.getPropertyValue("--wk-layout-sider-width")).toBe(
      "240px",
    );
    expect(wrapper.element.style.padding).toBe("");
    expect(wrapper.element.style.borderRadius).toBe("4px");
    expect(content.element.style.padding).toBe("16px");
    expect(content.element.style.width).toBe("");
    expect(content.element.style.minWidth).toBe("");
  });

  it("toggles sider collapsed state via max-width in transform mode", async () => {
    const wrapper = mount(WkLayoutSider, {
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
    await wrapper.get(".wk-layout-sider__trigger").trigger("click");
    await nextTick();
    expect(wrapper.emitted("update:collapsed")?.[0]).toEqual([true]);
    expect(wrapper.classes()).toContain("wk-layout-sider--collapsed");
    expect(wrapper.element.style.width).toBe("200px");
    expect(wrapper.element.style.maxWidth).toBe("48px");
    expect(wrapper.find(".wk-layout-sider__scroll").element.style.padding).toBe(
      "16px",
    );
  });

  it("shrinks sider width in width collapse mode", async () => {
    const wrapper = mount(WkLayoutSider, {
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
    await wrapper.get(".wk-layout-sider__trigger").trigger("click");
    await nextTick();
    expect(wrapper.element.style.width).toBe("0px");
    expect(wrapper.element.style.maxWidth).toBe("0px");
  });

  it("supports sider-placement right", async () => {
    const wrapper = mount(WkLayout, {
      props: { hasSider: true, siderPlacement: "right" },
      slots: {
        default: () => [
          h(WkLayoutSider, null, () => "Sider"),
          h(WkLayoutContent, null, () => "Main"),
        ],
      },
    });
    expect(wrapper.find(".wk-layout-sider").classes()).toContain(
      "wk-layout-sider--right-placement",
    );
  });

  it("always uses the native scroll container", () => {
    const wrapper = mount(WkLayout, {
      slots: {
        default: () => [
          h(WkLayoutHeader, null, () => "Header"),
          h(WkLayoutContent, null, () => "Body"),
        ],
      },
    });
    expect(wrapper.find(".wk-layout__scroll").exists()).toBe(true);
    expect(wrapper.find(".wk-layout__scrollbar").exists()).toBe(false);
    expect(wrapper.find(".wk-scrollbar").exists()).toBe(false);
  });
});
