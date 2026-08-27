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
    expect(header.element.style.minHeight).toBe("64px");
    expect(header.element.style.padding).toBe("12px");
    expect(header.element.style.borderRadius).toBe("8px");
  });

  it("uses default sider CSS dimensions and custom padding", () => {
    const wrapper = mount(WiLayoutSider, { props: { padding: 16, radius: 4 } });
    expect(wrapper.element.style.width).toBe("var(--wi-layout-sider-width)");
    expect(wrapper.element.style.maxWidth).toBe("var(--wi-layout-sider-width)");
    expect(wrapper.element.style.padding).toBe("16px");
    expect(wrapper.element.style.borderRadius).toBe("4px");
  });

  it("toggles sider collapsed state via max-width", async () => {
    const wrapper = mount(WiLayoutSider, {
      props: {
        showTrigger: "arrow-circle",
        width: 200,
        collapsedWidth: 48,
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

  it("uses WiScrollbar when nativeScrollbar is false", () => {
    const wrapper = mount(WiLayout, {
      props: { nativeScrollbar: false },
      slots: {
        default: () => [
          h(WiLayoutHeader, null, () => "Header"),
          h(WiLayoutContent, { nativeScrollbar: false }, () => "Body"),
        ],
      },
    });
    expect(wrapper.classes()).toContain("wi-layout--custom-scrollbar");
    expect(wrapper.find(".wi-layout__scrollbar").exists()).toBe(true);
    expect(wrapper.find(".wi-scrollbar").exists()).toBe(true);
  });
});
