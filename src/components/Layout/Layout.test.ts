import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { h, nextTick } from "vue";
import MLayout from "./Layout.vue";
import MLayoutContent from "./LayoutContent.vue";
import MLayoutFooter from "./LayoutFooter.vue";
import MLayoutHeader from "./LayoutHeader.vue";
import MLayoutSider from "./LayoutSider.vue";

describe('muLayout', () => {
  it("renders header content footer structure", () => {
    const wrapper = mount(MLayout, {
      slots: {
        default: () => [
          h(MLayoutHeader, null, () => "Header"),
          h(MLayoutContent, null, () => "Body"),
          h(MLayoutFooter, null, () => "Footer"),
        ],
      },
    });
    expect(wrapper.find(".m-layout-header").text()).toBe("Header");
    expect(wrapper.find(".m-layout-content").text()).toBe("Body");
    expect(wrapper.find(".m-layout-footer").text()).toBe("Footer");
  });

  it("enables has-sider row layout", () => {
    const wrapper = mount(MLayout, {
      props: { hasSider: true },
      slots: {
        default: () => [
          h(MLayoutSider, null, () => "Sider"),
          h(MLayoutContent, null, () => "Main"),
        ],
      },
    });
    expect(wrapper.classes()).toContain("m-layout--has-sider");
    expect(wrapper.find(".m-layout__scroll--has-sider").exists()).toBe(true);
    expect(wrapper.find(".m-layout-sider").classes()).toContain(
      "m-layout-sider--left-placement",
    );
  });

  it("keeps scroll container at full height", () => {
    const wrapper = mount(MLayout, {
      attrs: { style: "height: 200px" },
      slots: {
        default: () => [
          h(MLayoutHeader, null, () => "Header"),
          h(MLayoutContent, null, () => "Body"),
        ],
      },
    });
    expect(wrapper.classes()).toContain("m-layout--static-positioned");
    expect(wrapper.find(".m-layout__scroll").exists()).toBe(true);
  });

  it("shows the header bottom border by default and supports disabling it", () => {
    expect(mount(MLayoutHeader).classes()).toContain(
      "m-layout-header--bordered",
    );
    expect(
      mount(MLayoutHeader, { props: { bordered: false } }).classes(),
    ).not.toContain("m-layout-header--bordered");
  });

  it("applies layout dimension props", () => {
    const wrapper = mount(MLayout, {
      props: { height: 400, width: "80%" },
      slots: {
        default: () =>
          h(
            MLayoutHeader,
            { height: 64, padding: 12, radius: 8 },
            () => "Header",
          ),
      },
    });
    expect(wrapper.element.style.height).toBe("400px");
    expect(wrapper.element.style.width).toBe("80%");
    const header = wrapper.find<HTMLElement>(".m-layout-header");
    expect(header.element.style.height).toBe("64px");
    expect(header.element.style.padding).toBe("12px");
    expect(header.element.style.borderRadius).toBe("8px");
  });

  it("uses CSS percentage height by default", () => {
    const wrapper = mount(MLayout);
    expect(wrapper.element.style.height).toBe("");
    expect(wrapper.classes()).toContain("m-layout");
  });

  it("does not self-reference sider width tokens by default", () => {
    const wrapper = mount(MLayoutSider);
    expect(wrapper.element.style.getPropertyValue("--m-layout-sider-width")).toBe(
      "",
    );
    expect(
      wrapper.element.style.getPropertyValue("--m-layout-sider-collapsed-width"),
    ).toBe("");
    expect(wrapper.element.style.width).toBe("var(--m-layout-sider-width)");
    expect(wrapper.element.style.maxWidth).toBe("var(--m-layout-sider-width)");
  });

  it("does not write self-referencing var() props to sider width tokens", () => {
    const wrapper = mount(MLayoutSider, {
      props: {
        width: "var(--m-layout-sider-width)",
        collapsedWidth: "var(--m-layout-sider-collapsed-width)",
      },
    });
    expect(wrapper.element.style.getPropertyValue("--m-layout-sider-width")).toBe(
      "",
    );
    expect(
      wrapper.element.style.getPropertyValue("--m-layout-sider-collapsed-width"),
    ).toBe("");
    expect(wrapper.element.style.width).toBe("var(--m-layout-sider-width)");
  });

  it("uses the sider width only on the root element", () => {
    const wrapper = mount(MLayoutSider, {
      props: { width: 240, collapsedWidth: 56, padding: 16, radius: 4 },
    });
    const content = wrapper.find<HTMLElement>(".m-layout-sider__scroll");
    expect(wrapper.element.style.width).toBe("240px");
    expect(wrapper.element.style.maxWidth).toBe("240px");
    expect(wrapper.element.style.getPropertyValue("--m-layout-sider-width")).toBe(
      "240px",
    );
    expect(wrapper.element.style.padding).toBe("");
    expect(wrapper.element.style.borderRadius).toBe("4px");
    expect(content.element.style.padding).toBe("16px");
    expect(content.element.style.width).toBe("");
    expect(content.element.style.minWidth).toBe("");
  });

  it("toggles sider collapsed state via max-width in transform mode", async () => {
    const wrapper = mount(MLayoutSider, {
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
    await wrapper.get(".m-layout-sider__trigger").trigger("click");
    await nextTick();
    expect(wrapper.emitted("update:collapsed")?.[0]).toEqual([true]);
    expect(wrapper.classes()).toContain("m-layout-sider--collapsed");
    expect(wrapper.element.style.width).toBe("200px");
    expect(wrapper.element.style.maxWidth).toBe("48px");
    expect(wrapper.find(".m-layout-sider__scroll").element.style.padding).toBe(
      "16px",
    );
  });

  it("shrinks sider width in width collapse mode", async () => {
    const wrapper = mount(MLayoutSider, {
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
    await wrapper.get(".m-layout-sider__trigger").trigger("click");
    await nextTick();
    expect(wrapper.element.style.width).toBe("0px");
    expect(wrapper.element.style.maxWidth).toBe("0px");
  });

  it("supports sider-placement right", async () => {
    const wrapper = mount(MLayout, {
      props: { hasSider: true, siderPlacement: "right" },
      slots: {
        default: () => [
          h(MLayoutSider, null, () => "Sider"),
          h(MLayoutContent, null, () => "Main"),
        ],
      },
    });
    expect(wrapper.find(".m-layout-sider").classes()).toContain(
      "m-layout-sider--right-placement",
    );
  });

  it("always uses the native scroll container", () => {
    const wrapper = mount(MLayout, {
      slots: {
        default: () => [
          h(MLayoutHeader, null, () => "Header"),
          h(MLayoutContent, null, () => "Body"),
        ],
      },
    });
    expect(wrapper.find(".m-layout__scroll").exists()).toBe(true);
    expect(wrapper.find(".m-layout__scrollbar").exists()).toBe(false);
    expect(wrapper.find(".m-scrollbar").exists()).toBe(false);
  });
});
