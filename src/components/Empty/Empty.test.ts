import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import MEmpty from "./Empty.vue";

async function waitForGlyph(wrapper: ReturnType<typeof mount>) {
  await vi.waitFor(
    () => {
      expect(wrapper.find(".m-empty__glyph").exists()).toBe(true);
    },
    { timeout: 2000 },
  );
}

describe("MEmpty", () => {
  it("renders default locale description and lightweight empty icon", () => {
    const wrapper = mount(MEmpty);
    const root = wrapper.get(".m-empty");
    expect(root.attributes("role")).toBe("status");
    expect(root.classes()).toContain("m-empty");
    expect(root.classes()).toContain("m-empty--default-icon");
    expect(wrapper.find(".m-empty__description").text()).toBe("暂无数据");
    expect(wrapper.find(".m-empty__default-icon").exists()).toBe(true);
    expect(wrapper.find(".m-empty__glyph").exists()).toBe(false);
    expect(wrapper.find(".m-icon").exists()).toBe(false);
  });

  it("applies simple layout class", () => {
    const wrapper = mount(MEmpty, {
      props: {
        simple: true,
        title: "",
        description: "该分组下暂无成员",
      },
    });
    expect(wrapper.get(".m-empty").classes()).toContain("m-empty--simple");
    expect(wrapper.find(".m-empty__description").text()).toBe(
      "该分组下暂无成员",
    );
  });

  it("renders title, description, and extra slot with muted icon", () => {
    const wrapper = mount(MEmpty, {
      props: {
        title: "还没有课程",
        description: "创建第一门课程后即可展示。",
        icon: "book",
      },
      slots: {
        extra: '<button type="button">创建</button>',
      },
    });
    expect(wrapper.find(".m-empty__title").text()).toBe("还没有课程");
    expect(wrapper.find(".m-empty__description").text()).toContain(
      "创建第一门",
    );
    expect(wrapper.find(".m-empty__extra button").text()).toBe("创建");
    expect(wrapper.find(".m-icon").exists()).toBe(true);
    expect(wrapper.find(".m-empty__default-icon").exists()).toBe(false);
  });

  it("uses search illustration for icon=search", async () => {
    const wrapper = mount(MEmpty, {
      props: {
        title: "没有匹配结果",
        icon: "search",
      },
    });
    await waitForGlyph(wrapper);
    expect(wrapper.find(".m-icon").exists()).toBe(false);
    expect(wrapper.find(".m-empty__default-icon").exists()).toBe(false);
  });

  it("supports named illustration presets", async () => {
    const wrapper = mount(MEmpty, {
      props: {
        title: "没有新消息",
        illustration: "no-message",
      },
    });
    await waitForGlyph(wrapper);
    expect(wrapper.find(".m-icon").exists()).toBe(false);
    expect(wrapper.find(".m-empty__default-icon").exists()).toBe(false);
  });

  it("prefers image over icon", () => {
    const wrapper = mount(MEmpty, {
      props: {
        title: "Empty",
        image: "https://example.com/empty.svg",
        icon: "database",
      },
    });
    expect(wrapper.find(".m-empty__image").exists()).toBe(true);
    expect(wrapper.find(".m-icon").exists()).toBe(false);
    expect(wrapper.find(".m-empty__glyph").exists()).toBe(false);
    expect(wrapper.find(".m-empty__default-icon").exists()).toBe(false);
  });

  it("supports icon and default slots", () => {
    const wrapper = mount(MEmpty, {
      props: { title: "Custom" },
      slots: {
        icon: '<span class="custom-icon">*</span>',
        default: '<span class="custom-desc">Desc</span>',
      },
    });
    expect(wrapper.find(".custom-icon").exists()).toBe(true);
    expect(wrapper.find(".m-empty__title").text()).toBe("Custom");
    expect(wrapper.find(".custom-desc").text()).toBe("Desc");
    expect(wrapper.find(".m-empty__glyph").exists()).toBe(false);
    expect(wrapper.find(".m-empty__default-icon").exists()).toBe(false);
  });

  it("hides icon when showIcon is false", () => {
    const wrapper = mount(MEmpty, {
      props: { showIcon: false, description: "无图空态" },
    });
    expect(wrapper.find(".m-empty__illustration").exists()).toBe(false);
    expect(wrapper.find(".m-empty__description").text()).toBe("无图空态");
  });
});
