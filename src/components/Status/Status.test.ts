import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import MStatus from "./Status.vue";

describe("MStatus", () => {
  it("renders label with severity and size classes", () => {
    const wrapper = mount(MStatus, {
      props: { label: "Online", severity: "success", size: "large" },
    });
    expect(wrapper.text()).toBe("Online");
    expect(wrapper.classes()).toContain("m-status--success");
    expect(wrapper.classes()).toContain("m-status--large");
    expect(wrapper.classes()).toContain("m-status--dot");
    expect(wrapper.attributes("role")).toBe("status");
  });

  it("defaults severity to secondary with a dot", () => {
    const wrapper = mount(MStatus, { props: { label: "Idle" } });
    expect(wrapper.classes()).toContain("m-status--secondary");
    expect(wrapper.find(".m-status__dot").exists()).toBe(true);
    expect(wrapper.find(".m-status__icon").exists()).toBe(false);
  });

  it("auto-shows semantic icons for non-neutral severities", () => {
    const success = mount(MStatus, {
      props: { label: "Done", severity: "success" },
    });
    expect(success.find(".m-status__dot").exists()).toBe(false);
    expect(success.find(".m-status__icon").exists()).toBe(true);
    expect(success.find(".m-icon").exists()).toBe(true);
    expect(success.classes()).toContain("m-status--has-icon");

    const danger = mount(MStatus, {
      props: { label: "Failed", severity: "danger" },
    });
    expect(danger.find(".m-status__icon").exists()).toBe(true);
  });

  it("normalizes legacy warning severity to warn", () => {
    const wrapper = mount(MStatus, {
      props: { label: "Caution", severity: "warning" },
    });
    expect(wrapper.classes()).toContain("m-status--warn");
    expect(wrapper.classes()).not.toContain("m-status--warning");
    expect(wrapper.find(".m-status__icon").exists()).toBe(true);
  });

  it("renders slot content over label prop", () => {
    const wrapper = mount(MStatus, {
      props: { label: "Ignored" },
      slots: { default: "From slot" },
    });
    expect(wrapper.text()).toBe("From slot");
  });

  it("supports processing and custom color", () => {
    const wrapper = mount(MStatus, {
      props: { label: "Syncing", processing: true, color: "#0ea5e9" },
    });
    expect(wrapper.classes()).toContain("m-status--processing");
    expect(wrapper.classes()).toContain("m-status--custom");
    expect(wrapper.attributes("style")).toContain("--m-status-color");
  });

  it("supports tag and text variants", () => {
    const tag = mount(MStatus, {
      props: { label: "Done", severity: "success", variant: "tag" },
    });
    expect(tag.classes()).toContain("m-status--tag");
    expect(tag.find(".m-status__icon").exists()).toBe(true);

    const text = mount(MStatus, {
      props: { label: "Done", severity: "success", variant: "text" },
    });
    expect(text.classes()).toContain("m-status--text");
    expect(text.find(".m-status__dot").exists()).toBe(false);
    expect(text.find(".m-status__icon").exists()).toBe(false);
  });

  it("allows explicit icon override and disabled state", () => {
    const wrapper = mount(MStatus, {
      props: {
        label: "Failed",
        severity: "danger",
        icon: "close",
        disabled: true,
      },
    });
    expect(wrapper.find(".m-status__dot").exists()).toBe(false);
    expect(wrapper.find(".m-status__icon").exists()).toBe(true);
    expect(wrapper.find(".m-icon").exists()).toBe(true);
    expect(wrapper.classes()).toContain("m-status--disabled");
  });
});
