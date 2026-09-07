import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { h, nextTick } from "vue";
import RdLayout from "./Layout.vue";
import RdLayoutContent from "./LayoutContent.vue";
import RdLayoutFooter from "./LayoutFooter.vue";
import RdLayoutHeader from "./LayoutHeader.vue";
import RdLayoutSider from "./LayoutSider.vue";

describe("rdLayout", () => {
  it("renders header content footer structure", () => {
    const wrapper = mount(RdLayout, {
      slots: {
        default: () => [
          h(RdLayoutHeader, null, () => "Header"),
          h(RdLayoutContent, null, () => "Body"),
          h(RdLayoutFooter, null, () => "Footer"),
        ],
      },
    });
    expect(wrapper.find(".rd-layout-header").text()).toBe("Header");
    expect(wrapper.find(".rd-layout-content").text()).toBe("Body");
    expect(wrapper.find(".rd-layout-footer").text()).toBe("Footer");
  });

  it("enables has-sider row layout", () => {
    const wrapper = mount(RdLayout, {
      props: { hasSider: true },
      slots: {
        default: () => [
          h(RdLayoutSider, null, () => "Sider"),
          h(RdLayoutContent, null, () => "Main"),
        ],
      },
    });
    expect(wrapper.classes()).toContain("rd-layout--has-sider");
    expect(wrapper.find(".rd-layout__scroll--has-sider").exists()).toBe(true);
    expect(wrapper.find(".rd-layout-sider").classes()).toContain(
      "rd-layout-sider--left-placement",
    );
  });

  it("keeps scroll container at full height", () => {
    const wrapper = mount(RdLayout, {
      attrs: { style: "height: 200px" },
      slots: {
        default: () => [
          h(RdLayoutHeader, null, () => "Header"),
          h(RdLayoutContent, null, () => "Body"),
        ],
      },
    });
    expect(wrapper.classes()).toContain("rd-layout--static-positioned");
    expect(wrapper.find(".rd-layout__scroll").exists()).toBe(true);
  });

  it("shows the header bottom border by default and supports disabling it", () => {
    expect(mount(RdLayoutHeader).classes()).toContain(
      "rd-layout-header--bordered",
    );
    expect(
      mount(RdLayoutHeader, { props: { bordered: false } }).classes(),
    ).not.toContain("rd-layout-header--bordered");
  });

  it("applies layout dimension props", () => {
    const wrapper = mount(RdLayout, {
      props: { height: 400, width: "80%" },
      slots: {
        default: () =>
          h(
            RdLayoutHeader,
            { height: 64, padding: 12, radius: 8 },
            () => "Header",
          ),
      },
    });
    expect(wrapper.element.style.height).toBe("400px");
    expect(wrapper.element.style.width).toBe("80%");
    const header = wrapper.find<HTMLElement>(".rd-layout-header");
    expect(header.element.style.height).toBe("64px");
    expect(header.element.style.padding).toBe("12px");
    expect(header.element.style.borderRadius).toBe("8px");
  });

  it("uses CSS percentage height by default", () => {
    const wrapper = mount(RdLayout);
    expect(wrapper.element.style.height).toBe("");
    expect(wrapper.classes()).toContain("rd-layout");
  });

  it("does not self-reference sider width tokens by default", () => {
    const wrapper = mount(RdLayoutSider);
    expect(wrapper.element.style.getPropertyValue("--rd-layout-sider-width")).toBe(
      "",
    );
    expect(
      wrapper.element.style.getPropertyValue("--rd-layout-sider-collapsed-width"),
    ).toBe("");
    expect(wrapper.element.style.width).toBe("var(--rd-layout-sider-width)");
    expect(wrapper.element.style.maxWidth).toBe("var(--rd-layout-sider-width)");
  });

  it("does not write self-referencing var() props to sider width tokens", () => {
    const wrapper = mount(RdLayoutSider, {
      props: {
        width: "var(--rd-layout-sider-width)",
        collapsedWidth: "var(--rd-layout-sider-collapsed-width)",
      },
    });
    expect(wrapper.element.style.getPropertyValue("--rd-layout-sider-width")).toBe(
      "",
    );
    expect(
      wrapper.element.style.getPropertyValue("--rd-layout-sider-collapsed-width"),
    ).toBe("");
    expect(wrapper.element.style.width).toBe("var(--rd-layout-sider-width)");
  });

  it("uses the sider width only on the root element", () => {
    const wrapper = mount(RdLayoutSider, {
      props: { width: 240, collapsedWidth: 56, padding: 16, radius: 4 },
    });
    const content = wrapper.find<HTMLElement>(".rd-layout-sider__scroll");
    expect(wrapper.element.style.width).toBe("240px");
    expect(wrapper.element.style.maxWidth).toBe("240px");
    expect(wrapper.element.style.getPropertyValue("--rd-layout-sider-width")).toBe(
      "240px",
    );
    expect(wrapper.element.style.padding).toBe("");
    expect(wrapper.element.style.borderRadius).toBe("4px");
    expect(content.element.style.padding).toBe("16px");
    expect(content.element.style.width).toBe("");
    expect(content.element.style.minWidth).toBe("");
  });

  it("toggles sider collapsed state via max-width in transform mode", async () => {
    const wrapper = mount(RdLayoutSider, {
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
    await wrapper.get(".rd-layout-sider__trigger").trigger("click");
    await nextTick();
    expect(wrapper.emitted("update:collapsed")?.[0]).toEqual([true]);
    expect(wrapper.classes()).toContain("rd-layout-sider--collapsed");
    expect(wrapper.element.style.width).toBe("200px");
    expect(wrapper.element.style.maxWidth).toBe("48px");
    expect(wrapper.find(".rd-layout-sider__scroll").element.style.padding).toBe(
      "16px",
    );
  });

  it("shrinks sider width in width collapse mode", async () => {
    const wrapper = mount(RdLayoutSider, {
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
    await wrapper.get(".rd-layout-sider__trigger").trigger("click");
    await nextTick();
    expect(wrapper.element.style.width).toBe("0px");
    expect(wrapper.element.style.maxWidth).toBe("0px");
  });

  it("supports sider-placement right", async () => {
    const wrapper = mount(RdLayout, {
      props: { hasSider: true, siderPlacement: "right" },
      slots: {
        default: () => [
          h(RdLayoutSider, null, () => "Sider"),
          h(RdLayoutContent, null, () => "Main"),
        ],
      },
    });
    expect(wrapper.find(".rd-layout-sider").classes()).toContain(
      "rd-layout-sider--right-placement",
    );
  });

  it("always uses the native scroll container", () => {
    const wrapper = mount(RdLayout, {
      slots: {
        default: () => [
          h(RdLayoutHeader, null, () => "Header"),
          h(RdLayoutContent, null, () => "Body"),
        ],
      },
    });
    expect(wrapper.find(".rd-layout__scroll").exists()).toBe(true);
    expect(wrapper.find(".rd-layout__scrollbar").exists()).toBe(false);
    expect(wrapper.find(".rd-scrollbar").exists()).toBe(false);
  });
});
