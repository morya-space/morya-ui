import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { h, nextTick } from "vue";
import WdLayout from "./Layout.vue";
import WdLayoutContent from "./LayoutContent.vue";
import WdLayoutFooter from "./LayoutFooter.vue";
import WdLayoutHeader from "./LayoutHeader.vue";
import WdLayoutSider from "./LayoutSider.vue";

describe("wdLayout", () => {
  it("renders header content footer structure", () => {
    const wrapper = mount(WdLayout, {
      slots: {
        default: () => [
          h(WdLayoutHeader, null, () => "Header"),
          h(WdLayoutContent, null, () => "Body"),
          h(WdLayoutFooter, null, () => "Footer"),
        ],
      },
    });
    expect(wrapper.find(".wd-layout-header").text()).toBe("Header");
    expect(wrapper.find(".wd-layout-content").text()).toBe("Body");
    expect(wrapper.find(".wd-layout-footer").text()).toBe("Footer");
  });

  it("enables has-sider row layout", () => {
    const wrapper = mount(WdLayout, {
      props: { hasSider: true },
      slots: {
        default: () => [
          h(WdLayoutSider, null, () => "Sider"),
          h(WdLayoutContent, null, () => "Main"),
        ],
      },
    });
    expect(wrapper.classes()).toContain("wd-layout--has-sider");
    expect(wrapper.find(".wd-layout__scroll--has-sider").exists()).toBe(true);
    expect(wrapper.find(".wd-layout-sider").classes()).toContain(
      "wd-layout-sider--left-placement",
    );
  });

  it("keeps scroll container at full height", () => {
    const wrapper = mount(WdLayout, {
      attrs: { style: "height: 200px" },
      slots: {
        default: () => [
          h(WdLayoutHeader, null, () => "Header"),
          h(WdLayoutContent, null, () => "Body"),
        ],
      },
    });
    expect(wrapper.classes()).toContain("wd-layout--static-positioned");
    expect(wrapper.find(".wd-layout__scroll").exists()).toBe(true);
  });

  it("shows the header bottom border by default and supports disabling it", () => {
    expect(mount(WdLayoutHeader).classes()).toContain(
      "wd-layout-header--bordered",
    );
    expect(
      mount(WdLayoutHeader, { props: { bordered: false } }).classes(),
    ).not.toContain("wd-layout-header--bordered");
  });

  it("applies layout dimension props", () => {
    const wrapper = mount(WdLayout, {
      props: { height: 400, width: "80%" },
      slots: {
        default: () =>
          h(
            WdLayoutHeader,
            { height: 64, padding: 12, radius: 8 },
            () => "Header",
          ),
      },
    });
    expect(wrapper.element.style.height).toBe("400px");
    expect(wrapper.element.style.width).toBe("80%");
    const header = wrapper.find<HTMLElement>(".wd-layout-header");
    expect(header.element.style.height).toBe("64px");
    expect(header.element.style.padding).toBe("12px");
    expect(header.element.style.borderRadius).toBe("8px");
  });

  it("uses CSS percentage height by default", () => {
    const wrapper = mount(WdLayout);
    expect(wrapper.element.style.height).toBe("");
    expect(wrapper.classes()).toContain("wd-layout");
  });

  it("does not self-reference sider width tokens by default", () => {
    const wrapper = mount(WdLayoutSider);
    expect(wrapper.element.style.getPropertyValue("--wd-layout-sider-width")).toBe(
      "",
    );
    expect(
      wrapper.element.style.getPropertyValue("--wd-layout-sider-collapsed-width"),
    ).toBe("");
    expect(wrapper.element.style.width).toBe("var(--wd-layout-sider-width)");
    expect(wrapper.element.style.maxWidth).toBe("var(--wd-layout-sider-width)");
  });

  it("does not write self-referencing var() props to sider width tokens", () => {
    const wrapper = mount(WdLayoutSider, {
      props: {
        width: "var(--wd-layout-sider-width)",
        collapsedWidth: "var(--wd-layout-sider-collapsed-width)",
      },
    });
    expect(wrapper.element.style.getPropertyValue("--wd-layout-sider-width")).toBe(
      "",
    );
    expect(
      wrapper.element.style.getPropertyValue("--wd-layout-sider-collapsed-width"),
    ).toBe("");
    expect(wrapper.element.style.width).toBe("var(--wd-layout-sider-width)");
  });

  it("uses the sider width only on the root element", () => {
    const wrapper = mount(WdLayoutSider, {
      props: { width: 240, collapsedWidth: 56, padding: 16, radius: 4 },
    });
    const content = wrapper.find<HTMLElement>(".wd-layout-sider__scroll");
    expect(wrapper.element.style.width).toBe("240px");
    expect(wrapper.element.style.maxWidth).toBe("240px");
    expect(wrapper.element.style.getPropertyValue("--wd-layout-sider-width")).toBe(
      "240px",
    );
    expect(wrapper.element.style.padding).toBe("");
    expect(wrapper.element.style.borderRadius).toBe("4px");
    expect(content.element.style.padding).toBe("16px");
    expect(content.element.style.width).toBe("");
    expect(content.element.style.minWidth).toBe("");
  });

  it("toggles sider collapsed state via max-width in transform mode", async () => {
    const wrapper = mount(WdLayoutSider, {
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
    await wrapper.get(".wd-layout-sider__trigger").trigger("click");
    await nextTick();
    expect(wrapper.emitted("update:collapsed")?.[0]).toEqual([true]);
    expect(wrapper.classes()).toContain("wd-layout-sider--collapsed");
    expect(wrapper.element.style.width).toBe("200px");
    expect(wrapper.element.style.maxWidth).toBe("48px");
    expect(wrapper.find(".wd-layout-sider__scroll").element.style.padding).toBe(
      "16px",
    );
  });

  it("shrinks sider width in width collapse mode", async () => {
    const wrapper = mount(WdLayoutSider, {
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
    await wrapper.get(".wd-layout-sider__trigger").trigger("click");
    await nextTick();
    expect(wrapper.element.style.width).toBe("0px");
    expect(wrapper.element.style.maxWidth).toBe("0px");
  });

  it("supports sider-placement right", async () => {
    const wrapper = mount(WdLayout, {
      props: { hasSider: true, siderPlacement: "right" },
      slots: {
        default: () => [
          h(WdLayoutSider, null, () => "Sider"),
          h(WdLayoutContent, null, () => "Main"),
        ],
      },
    });
    expect(wrapper.find(".wd-layout-sider").classes()).toContain(
      "wd-layout-sider--right-placement",
    );
  });

  it("always uses the native scroll container", () => {
    const wrapper = mount(WdLayout, {
      slots: {
        default: () => [
          h(WdLayoutHeader, null, () => "Header"),
          h(WdLayoutContent, null, () => "Body"),
        ],
      },
    });
    expect(wrapper.find(".wd-layout__scroll").exists()).toBe(true);
    expect(wrapper.find(".wd-layout__scrollbar").exists()).toBe(false);
    expect(wrapper.find(".wd-scrollbar").exists()).toBe(false);
  });
});
