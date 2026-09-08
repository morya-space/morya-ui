import type { Component } from 'vue'
import WkAccordion from './components/Accordion/Accordion.vue'
import WkAutoComplete from './components/AutoComplete/AutoComplete.vue'
import WkAvatar from './components/Avatar/Avatar.vue'
import WkAvatarGroup from './components/Avatar/AvatarGroup.vue'
import WkBadge from './components/Badge/Badge.vue'
import WkBlockUI from './components/BlockUI/BlockUI.vue'
import WkBreadcrumb from './components/Breadcrumb/Breadcrumb.vue'
import WkButton from './components/Button/Button.vue'
import WkButtonGroup from './components/Button/ButtonGroup.vue'
import WkCard from './components/Card/Card.vue'
import WkCarousel from './components/Carousel/Carousel.vue'
import WkCascadeSelect from './components/CascadeSelect/CascadeSelect.vue'
import WkCheckbox from './components/Checkbox/Checkbox.vue'
import WkCheckboxGroup from './components/Checkbox/CheckboxGroup.vue'
import WkChip from './components/Chip/Chip.vue'
import WkCommandMenu from './components/CommandMenu/CommandMenu.vue'
import WkConfigProvider from './components/ConfigProvider/ConfigProvider.vue'
import WkConfirmDialog from './components/ConfirmDialog/ConfirmDialog.vue'
import WkConfirmPopup from './components/ConfirmPopup/ConfirmPopup.vue'
import WkContextMenu from './components/ContextMenu/ContextMenu.vue'
import WkDataView from './components/DataView/DataView.vue'
import WkDatePicker from './components/DatePicker/DatePicker.vue'
import WkDialog from './components/Dialog/Dialog.vue'
import WkDivider from './components/Divider/Divider.vue'
import WkDock from './components/Dock/Dock.vue'
import WkDrawer from './components/Drawer/Drawer.vue'
import WkDropdown from './components/Dropdown/Dropdown.vue'
import WkFieldset from './components/Fieldset/Fieldset.vue'
import WkFileUpload from './components/FileUpload/FileUpload.vue'
import WkFlex from './components/Flex/Flex.vue'
import WkFloatLabel from './components/FloatLabel/FloatLabel.vue'
import WkFluid from './components/Fluid/Fluid.vue'
import WkForm from './components/Form/Form.vue'
import WkFormItem from './components/Form/FormItem.vue'
import WkGallery from './components/Gallery/Gallery.vue'
import WkGrid from './components/Grid/Grid.vue'
import WkGi from './components/Grid/GridItem.vue'
import WkGridItem from './components/Grid/GridItem.vue'
import WkIcon from './components/Icon/Icon.vue'
import WkIconField from './components/IconField/IconField.vue'
import WkInplace from './components/Inplace/Inplace.vue'
import WkInput from './components/Input/Input.vue'
import WkInputColor from './components/InputColor/InputColor.vue'
import WkInputGroup from './components/InputGroup/InputGroup.vue'
import WkInputGroupAddon from './components/InputGroup/InputGroupAddon.vue'
import WkInputNumber from './components/InputNumber/InputNumber.vue'
import WkInputOtp from './components/InputOtp/InputOtp.vue'
import WkInputPassword from './components/InputPassword/InputPassword.vue'
import WkInputTags from './components/InputTags/InputTags.vue'
import WkKnob from './components/Knob/Knob.vue'
import WkLabel from './components/Label/Label.vue'
import WkLayout from './components/Layout/Layout.vue'
import WkLayoutContent from './components/Layout/LayoutContent.vue'
import WkLayoutFooter from './components/Layout/LayoutFooter.vue'
import WkLayoutHeader from './components/Layout/LayoutHeader.vue'
import WkLayoutSider from './components/Layout/LayoutSider.vue'
import WkListbox from './components/Listbox/Listbox.vue'
import WkMegaMenu from './components/MegaMenu/MegaMenu.vue'
import WkMenu from './components/Menu/Menu.vue'
import WkMenubar from './components/Menubar/Menubar.vue'
import WkMessage from './components/Message/Message.vue'
import WkMeterGroup from './components/MeterGroup/MeterGroup.vue'
import WkOrderList from './components/OrderList/OrderList.vue'
import WkPagination from './components/Pagination/Pagination.vue'
import WkPanel from './components/Panel/Panel.vue'
import WkPickList from './components/PickList/PickList.vue'
import WkPopover from './components/Popover/Popover.vue'
import WkProgressBar from './components/ProgressBar/ProgressBar.vue'
import WkProgressSpinner from './components/ProgressSpinner/ProgressSpinner.vue'
import WkRadio from './components/Radio/Radio.vue'
import WkRadioGroup from './components/Radio/RadioGroup.vue'
import WkRating from './components/Rating/Rating.vue'
import WkScrollbar from './components/Scrollbar/Scrollbar.vue'
import WkScrollTop from './components/ScrollTop/ScrollTop.vue'
import WkSelect from './components/Select/Select.vue'
import WkSelectButton from './components/SelectButton/SelectButton.vue'
import WkSidebar from './components/Sidebar/Sidebar.vue'
import WkSkeleton from './components/Skeleton/Skeleton.vue'
import WkSlider from './components/Slider/Slider.vue'
import WkSpace from './components/Space/Space.vue'
import WkSpeedDial from './components/SpeedDial/SpeedDial.vue'
import WkSplitButton from './components/SplitButton/SplitButton.vue'
import WkSplitter from './components/Splitter/Splitter.vue'
import WkStepper from './components/Stepper/Stepper.vue'
import WkSwitch from './components/Switch/Switch.vue'
import WkTable from './components/Table/Table.vue'
import WkTabs from './components/Tabs/Tabs.vue'
import WkTag from './components/Tag/Tag.vue'
import WkTerminal from './components/Terminal/Terminal.vue'
import WkTextarea from './components/Textarea/Textarea.vue'
import WkTieredMenu from './components/TieredMenu/TieredMenu.vue'
import WkTimeline from './components/Timeline/Timeline.vue'
import WkToast from './components/Toast/Toast.vue'
import WkToggleButton from './components/ToggleButton/ToggleButton.vue'
import WkToolbar from './components/Toolbar/Toolbar.vue'
import WkTooltip from './components/Tooltip/Tooltip.vue'
import WkTree from './components/Tree/Tree.vue'
import WkTreeSelect from './components/TreeSelect/TreeSelect.vue'
import WkTreeTable from './components/TreeTable/TreeTable.vue'
import WkVirtualScroller from './components/VirtualScroller/VirtualScroller.vue'

/** Public components available for global registration (`app.use`). */
export const wkComponents: Record<string, Component> = {
  WkAccordion,
  WkAutoComplete,
  WkAvatar,
  WkAvatarGroup,
  WkBadge,
  WkBlockUI,
  WkBreadcrumb,
  WkButton,
  WkButtonGroup,
  WkCard,
  WkCarousel,
  WkCascadeSelect,
  WkCheckbox,
  WkCheckboxGroup,
  WkChip,
  WkCommandMenu,
  WkConfigProvider,
  WkConfirmDialog,
  WkConfirmPopup,
  WkContextMenu,
  WkDataView,
  WkDatePicker,
  WkDialog,
  WkDivider,
  WkDock,
  WkDrawer,
  WkDropdown,
  WkFieldset,
  WkFileUpload,
  WkFlex,
  WkFloatLabel,
  WkFluid,
  WkForm,
  WkFormItem,
  WkGallery,
  WkGi,
  WkGrid,
  WkGridItem,
  WkIcon,
  WkIconField,
  WkInplace,
  WkInput,
  WkInputColor,
  WkInputGroup,
  WkInputGroupAddon,
  WkInputNumber,
  WkInputOtp,
  WkInputPassword,
  WkInputTags,
  WkKnob,
  WkLabel,
  WkLayout,
  WkLayoutContent,
  WkLayoutFooter,
  WkLayoutHeader,
  WkLayoutSider,
  WkListbox,
  WkMegaMenu,
  WkMenu,
  WkMenubar,
  WkMessage,
  WkMeterGroup,
  WkOrderList,
  WkPagination,
  WkPanel,
  WkPickList,
  WkPopover,
  WkProgressBar,
  WkProgressSpinner,
  WkRadio,
  WkRadioGroup,
  WkRating,
  WkScrollbar,
  WkScrollTop,
  WkSelect,
  WkSelectButton,
  WkSidebar,
  WkSkeleton,
  WkSlider,
  WkSpace,
  WkSpeedDial,
  WkSplitButton,
  WkSplitter,
  WkStepper,
  WkSwitch,
  WkTable,
  WkTabs,
  WkTag,
  WkTerminal,
  WkTextarea,
  WkTieredMenu,
  WkTimeline,
  WkToast,
  WkToggleButton,
  WkToolbar,
  WkTooltip,
  WkTree,
  WkTreeSelect,
  WkTreeTable,
  WkVirtualScroller,
}

export const wkComponentNames = Object.keys(wkComponents)
