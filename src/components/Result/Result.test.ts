import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import MResult from "./Result.vue";

describe("MResult", () => {
  it("renders success status with locale title", () => {
    const wrapper = mount(MResult, { props: { status: "success" } });
    expect(wrapper.classes()).toContain("m-result--success");
    expect(wrapper.find(".m-result__title").text()).toBe("操作成功");
    expect(wrapper.find(".m-icon").exists()).toBe(true);
    expect(wrapper.attributes("role")).toBe("status");
  });

  it("supports warning and error statuses", () => {
    const warn = mount(MResult, { props: { status: "warning" } });
    expect(warn.classes()).toContain("m-result--warning");
    expect(warn.find(".m-result__title").text()).toBe("警告");

    const error = mount(MResult, { props: { status: "error" } });
    expect(error.classes()).toContain("m-result--error");
    expect(error.find(".m-result__title").text()).toBe("操作失败");
  });

  it("renders http statuses with built-in illustrations", () => {
    const wrapper = mount(MResult, {
      props: {
        status: "404",
        description: "页面不存在或已被移除。",
      },
    });
    expect(wrapper.classes()).toContain("m-result--404");
    expect(wrapper.find(".m-result__illustration").exists()).toBe(true);
    expect(wrapper.find(".m-result__icon").exists()).toBe(false);
    expect(wrapper.find(".m-result__title").text()).toBe("页面不存在");
    expect(wrapper.find(".m-result__description").text()).toContain("已被移除");
  });

  it("keeps icon mode for http status when icon is overridden", () => {
    const wrapper = mount(MResult, {
      props: {
        status: "404",
        icon: "search",
      },
    });
    expect(wrapper.find(".m-result__illustration").exists()).toBe(false);
    expect(wrapper.find(".m-result__icon").exists()).toBe(true);
    expect(wrapper.find(".m-icon").exists()).toBe(true);
  });

  it("supports 418 teapot status", () => {
    const wrapper = mount(MResult, { props: { status: "418" } });
    expect(wrapper.classes()).toContain("m-result--418");
    expect(wrapper.find(".m-result__illustration").exists()).toBe(true);
    expect(wrapper.find(".m-result__title").text()).toBe("我是个茶壶");
  });

  it("applies size class", () => {
    const wrapper = mount(MResult, {
      props: {
        status: "success",
        size: "small",
      },
    });
    expect(wrapper.classes()).toContain("m-result--small");
  });

  it("allows custom title, content, and footer actions", () => {
    const wrapper = mount(MResult, {
      props: {
        status: "success",
        title: "提交完成",
        icon: "check",
      },
      slots: {
        default: "<p class=\"detail\">详情</p>",
        footer: '<button type="button">返回</button>',
      },
    });
    expect(wrapper.find(".m-result__title").text()).toBe("提交完成");
    expect(wrapper.find(".m-result__content .detail").text()).toBe("详情");
    expect(wrapper.find(".m-result__footer button").text()).toBe("返回");
  });
});
