import type { Component } from 'vue'
import WiAccordion from './components/Accordion/Accordion.vue'
import WiAutoComplete from './components/AutoComplete/AutoComplete.vue'
import WiAvatar from './components/Avatar/Avatar.vue'
import WiBadge from './components/Badge/Badge.vue'
import WiBlockUI from './components/BlockUI/BlockUI.vue'
import WiBreadcrumb from './components/Breadcrumb/Breadcrumb.vue'
import WiButton from './components/Button/Button.vue'
import WiCard from './components/Card/Card.vue'
import WiCarousel from './components/Carousel/Carousel.vue'
import WiCascadeSelect from './components/CascadeSelect/CascadeSelect.vue'
import WiCheckbox from './components/Checkbox/Checkbox.vue'
import WiChip from './components/Chip/Chip.vue'
import WiCommandMenu from './components/CommandMenu/CommandMenu.vue'
import WiConfigProvider from './components/ConfigProvider/ConfigProvider.vue'
import WiConfirmDialog from './components/ConfirmDialog/ConfirmDialog.vue'
import WiConfirmPopup from './components/ConfirmPopup/ConfirmPopup.vue'
import WiContextMenu from './components/ContextMenu/ContextMenu.vue'
import WiDataView from './components/DataView/DataView.vue'
import WiDatePicker from './components/DatePicker/DatePicker.vue'
import WiDialog from './components/Dialog/Dialog.vue'
import WiDivider from './components/Divider/Divider.vue'
import WiDock from './components/Dock/Dock.vue'
import WiDrawer from './components/Drawer/Drawer.vue'
import WiDropdown from './components/Dropdown/Dropdown.vue'
import WiFieldset from './components/Fieldset/Fieldset.vue'
import WiFileUpload from './components/FileUpload/FileUpload.vue'
import WiFloatLabel from './components/FloatLabel/FloatLabel.vue'
import WiFlex from './components/Flex/Flex.vue'
import WiFluid from './components/Fluid/Fluid.vue'
import WiForm from './components/Form/Form.vue'
import WiFormItem from './components/Form/FormItem.vue'
import WiGallery from './components/Gallery/Gallery.vue'
import WiGi from './components/Grid/GridItem.vue'
import WiGrid from './components/Grid/Grid.vue'
import WiGridItem from './components/Grid/GridItem.vue'
import WiIcon from './components/Icon/Icon.vue'
import WiIconField from './components/IconField/IconField.vue'
import WiInplace from './components/Inplace/Inplace.vue'
import WiInput from './components/Input/Input.vue'
import WiInputColor from './components/InputColor/InputColor.vue'
import WiInputGroup from './components/InputGroup/InputGroup.vue'
import WiInputGroupAddon from './components/InputGroup/InputGroupAddon.vue'
import WiInputNumber from './components/InputNumber/InputNumber.vue'
import WiInputOtp from './components/InputOtp/InputOtp.vue'
import WiInputPassword from './components/InputPassword/InputPassword.vue'
import WiInputTags from './components/InputTags/InputTags.vue'
import WiKnob from './components/Knob/Knob.vue'
import WiLabel from './components/Label/Label.vue'
import WiLayout from './components/Layout/Layout.vue'
import WiLayoutContent from './components/Layout/LayoutContent.vue'
import WiLayoutFooter from './components/Layout/LayoutFooter.vue'
import WiLayoutHeader from './components/Layout/LayoutHeader.vue'
import WiLayoutSider from './components/Layout/LayoutSider.vue'
import WiListbox from './components/Listbox/Listbox.vue'
import WiMegaMenu from './components/MegaMenu/MegaMenu.vue'
import WiMenu from './components/Menu/Menu.vue'
import WiMenubar from './components/Menubar/Menubar.vue'
import WiMessage from './components/Message/Message.vue'
import WiMeterGroup from './components/MeterGroup/MeterGroup.vue'
import WiOrderList from './components/OrderList/OrderList.vue'
import WiPagination from './components/Pagination/Pagination.vue'
import WiPanel from './components/Panel/Panel.vue'
import WiPickList from './components/PickList/PickList.vue'
import WiPopover from './components/Popover/Popover.vue'
import WiProgressBar from './components/ProgressBar/ProgressBar.vue'
import WiProgressSpinner from './components/ProgressSpinner/ProgressSpinner.vue'
import WiRadio from './components/Radio/Radio.vue'
import WiRating from './components/Rating/Rating.vue'
import WiScrollbar from './components/Scrollbar/Scrollbar.vue'
import WiScrollTop from './components/ScrollTop/ScrollTop.vue'
import WiSelect from './components/Select/Select.vue'
import WiSelectButton from './components/SelectButton/SelectButton.vue'
import WiSidebar from './components/Sidebar/Sidebar.vue'
import WiSkeleton from './components/Skeleton/Skeleton.vue'
import WiSlider from './components/Slider/Slider.vue'
import WiSpace from './components/Space/Space.vue'
import WiSpeedDial from './components/SpeedDial/SpeedDial.vue'
import WiSplitButton from './components/SplitButton/SplitButton.vue'
import WiSplitter from './components/Splitter/Splitter.vue'
import WiStepper from './components/Stepper/Stepper.vue'
import WiSwitch from './components/Switch/Switch.vue'
import WiTable from './components/Table/Table.vue'
import WiTabs from './components/Tabs/Tabs.vue'
import WiTag from './components/Tag/Tag.vue'
import WiTerminal from './components/Terminal/Terminal.vue'
import WiTextarea from './components/Textarea/Textarea.vue'
import WiTieredMenu from './components/TieredMenu/TieredMenu.vue'
import WiTimeline from './components/Timeline/Timeline.vue'
import WiToast from './components/Toast/Toast.vue'
import WiToggleButton from './components/ToggleButton/ToggleButton.vue'
import WiToolbar from './components/Toolbar/Toolbar.vue'
import WiTooltip from './components/Tooltip/Tooltip.vue'
import WiTree from './components/Tree/Tree.vue'
import WiTreeSelect from './components/TreeSelect/TreeSelect.vue'
import WiTreeTable from './components/TreeTable/TreeTable.vue'
import WiVirtualScroller from './components/VirtualScroller/VirtualScroller.vue'

/** Public components available for global registration (`app.use`). */
export const wiComponents: Record<string, Component> = {
  WiAccordion,
  WiAutoComplete,
  WiAvatar,
  WiBadge,
  WiBlockUI,
  WiBreadcrumb,
  WiButton,
  WiCard,
  WiCarousel,
  WiCascadeSelect,
  WiCheckbox,
  WiChip,
  WiCommandMenu,
  WiConfigProvider,
  WiConfirmDialog,
  WiConfirmPopup,
  WiContextMenu,
  WiDataView,
  WiDatePicker,
  WiDialog,
  WiDivider,
  WiDock,
  WiDrawer,
  WiDropdown,
  WiFieldset,
  WiFileUpload,
  WiFlex,
  WiFloatLabel,
  WiFluid,
  WiForm,
  WiFormItem,
  WiGallery,
  WiGi,
  WiGrid,
  WiGridItem,
  WiIcon,
  WiIconField,
  WiInplace,
  WiInput,
  WiInputColor,
  WiInputGroup,
  WiInputGroupAddon,
  WiInputNumber,
  WiInputOtp,
  WiInputPassword,
  WiInputTags,
  WiKnob,
  WiLabel,
  WiLayout,
  WiLayoutContent,
  WiLayoutFooter,
  WiLayoutHeader,
  WiLayoutSider,
  WiListbox,
  WiMegaMenu,
  WiMenu,
  WiMenubar,
  WiMessage,
  WiMeterGroup,
  WiOrderList,
  WiPagination,
  WiPanel,
  WiPickList,
  WiPopover,
  WiProgressBar,
  WiProgressSpinner,
  WiRadio,
  WiRating,
  WiScrollbar,
  WiScrollTop,
  WiSelect,
  WiSelectButton,
  WiSidebar,
  WiSkeleton,
  WiSlider,
  WiSpace,
  WiSpeedDial,
  WiSplitButton,
  WiSplitter,
  WiStepper,
  WiSwitch,
  WiTable,
  WiTabs,
  WiTag,
  WiTerminal,
  WiTextarea,
  WiTieredMenu,
  WiTimeline,
  WiToast,
  WiToggleButton,
  WiToolbar,
  WiTooltip,
  WiTree,
  WiTreeSelect,
  WiTreeTable,
  WiVirtualScroller,
}

export const wiComponentNames = Object.keys(wiComponents)
