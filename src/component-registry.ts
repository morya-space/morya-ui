import type { Component } from 'vue'
import WdAccordion from './components/Accordion/Accordion.vue'
import WdAutoComplete from './components/AutoComplete/AutoComplete.vue'
import WdAvatar from './components/Avatar/Avatar.vue'
import WdAvatarGroup from './components/Avatar/AvatarGroup.vue'
import WdBadge from './components/Badge/Badge.vue'
import WdBlockUI from './components/BlockUI/BlockUI.vue'
import WdBreadcrumb from './components/Breadcrumb/Breadcrumb.vue'
import WdButton from './components/Button/Button.vue'
import WdButtonGroup from './components/Button/ButtonGroup.vue'
import WdCard from './components/Card/Card.vue'
import WdCarousel from './components/Carousel/Carousel.vue'
import WdCascadeSelect from './components/CascadeSelect/CascadeSelect.vue'
import WdCheckbox from './components/Checkbox/Checkbox.vue'
import WdCheckboxGroup from './components/Checkbox/CheckboxGroup.vue'
import WdChip from './components/Chip/Chip.vue'
import WdCommandMenu from './components/CommandMenu/CommandMenu.vue'
import WdConfigProvider from './components/ConfigProvider/ConfigProvider.vue'
import WdConfirmDialog from './components/ConfirmDialog/ConfirmDialog.vue'
import WdConfirmPopup from './components/ConfirmPopup/ConfirmPopup.vue'
import WdContextMenu from './components/ContextMenu/ContextMenu.vue'
import WdDataView from './components/DataView/DataView.vue'
import WdDatePicker from './components/DatePicker/DatePicker.vue'
import WdDialog from './components/Dialog/Dialog.vue'
import WdDivider from './components/Divider/Divider.vue'
import WdDock from './components/Dock/Dock.vue'
import WdDrawer from './components/Drawer/Drawer.vue'
import WdDropdown from './components/Dropdown/Dropdown.vue'
import WdFieldset from './components/Fieldset/Fieldset.vue'
import WdFileUpload from './components/FileUpload/FileUpload.vue'
import WdFlex from './components/Flex/Flex.vue'
import WdFloatLabel from './components/FloatLabel/FloatLabel.vue'
import WdFluid from './components/Fluid/Fluid.vue'
import WdForm from './components/Form/Form.vue'
import WdFormItem from './components/Form/FormItem.vue'
import WdGallery from './components/Gallery/Gallery.vue'
import WdGrid from './components/Grid/Grid.vue'
import WdGi from './components/Grid/GridItem.vue'
import WdGridItem from './components/Grid/GridItem.vue'
import WdIcon from './components/Icon/Icon.vue'
import WdIconField from './components/IconField/IconField.vue'
import WdInplace from './components/Inplace/Inplace.vue'
import WdInput from './components/Input/Input.vue'
import WdInputColor from './components/InputColor/InputColor.vue'
import WdInputGroup from './components/InputGroup/InputGroup.vue'
import WdInputGroupAddon from './components/InputGroup/InputGroupAddon.vue'
import WdInputNumber from './components/InputNumber/InputNumber.vue'
import WdInputOtp from './components/InputOtp/InputOtp.vue'
import WdInputPassword from './components/InputPassword/InputPassword.vue'
import WdInputTags from './components/InputTags/InputTags.vue'
import WdKnob from './components/Knob/Knob.vue'
import WdLabel from './components/Label/Label.vue'
import WdLayout from './components/Layout/Layout.vue'
import WdLayoutContent from './components/Layout/LayoutContent.vue'
import WdLayoutFooter from './components/Layout/LayoutFooter.vue'
import WdLayoutHeader from './components/Layout/LayoutHeader.vue'
import WdLayoutSider from './components/Layout/LayoutSider.vue'
import WdListbox from './components/Listbox/Listbox.vue'
import WdMegaMenu from './components/MegaMenu/MegaMenu.vue'
import WdMenu from './components/Menu/Menu.vue'
import WdMenubar from './components/Menubar/Menubar.vue'
import WdMessage from './components/Message/Message.vue'
import WdMeterGroup from './components/MeterGroup/MeterGroup.vue'
import WdOrderList from './components/OrderList/OrderList.vue'
import WdPagination from './components/Pagination/Pagination.vue'
import WdPanel from './components/Panel/Panel.vue'
import WdPickList from './components/PickList/PickList.vue'
import WdPopover from './components/Popover/Popover.vue'
import WdProgressBar from './components/ProgressBar/ProgressBar.vue'
import WdProgressSpinner from './components/ProgressSpinner/ProgressSpinner.vue'
import WdRadio from './components/Radio/Radio.vue'
import WdRadioGroup from './components/Radio/RadioGroup.vue'
import WdRating from './components/Rating/Rating.vue'
import WdScrollbar from './components/Scrollbar/Scrollbar.vue'
import WdScrollTop from './components/ScrollTop/ScrollTop.vue'
import WdSelect from './components/Select/Select.vue'
import WdSelectButton from './components/SelectButton/SelectButton.vue'
import WdSidebar from './components/Sidebar/Sidebar.vue'
import WdSkeleton from './components/Skeleton/Skeleton.vue'
import WdSlider from './components/Slider/Slider.vue'
import WdSpace from './components/Space/Space.vue'
import WdSpeedDial from './components/SpeedDial/SpeedDial.vue'
import WdSplitButton from './components/SplitButton/SplitButton.vue'
import WdSplitter from './components/Splitter/Splitter.vue'
import WdStepper from './components/Stepper/Stepper.vue'
import WdSwitch from './components/Switch/Switch.vue'
import WdTable from './components/Table/Table.vue'
import WdTabs from './components/Tabs/Tabs.vue'
import WdTag from './components/Tag/Tag.vue'
import WdTerminal from './components/Terminal/Terminal.vue'
import WdTextarea from './components/Textarea/Textarea.vue'
import WdTieredMenu from './components/TieredMenu/TieredMenu.vue'
import WdTimeline from './components/Timeline/Timeline.vue'
import WdToast from './components/Toast/Toast.vue'
import WdToggleButton from './components/ToggleButton/ToggleButton.vue'
import WdToolbar from './components/Toolbar/Toolbar.vue'
import WdTooltip from './components/Tooltip/Tooltip.vue'
import WdTree from './components/Tree/Tree.vue'
import WdTreeSelect from './components/TreeSelect/TreeSelect.vue'
import WdTreeTable from './components/TreeTable/TreeTable.vue'
import WdVirtualScroller from './components/VirtualScroller/VirtualScroller.vue'

/** Public components available for global registration (`app.use`). */
export const wdComponents: Record<string, Component> = {
  WdAccordion,
  WdAutoComplete,
  WdAvatar,
  WdAvatarGroup,
  WdBadge,
  WdBlockUI,
  WdBreadcrumb,
  WdButton,
  WdButtonGroup,
  WdCard,
  WdCarousel,
  WdCascadeSelect,
  WdCheckbox,
  WdCheckboxGroup,
  WdChip,
  WdCommandMenu,
  WdConfigProvider,
  WdConfirmDialog,
  WdConfirmPopup,
  WdContextMenu,
  WdDataView,
  WdDatePicker,
  WdDialog,
  WdDivider,
  WdDock,
  WdDrawer,
  WdDropdown,
  WdFieldset,
  WdFileUpload,
  WdFlex,
  WdFloatLabel,
  WdFluid,
  WdForm,
  WdFormItem,
  WdGallery,
  WdGi,
  WdGrid,
  WdGridItem,
  WdIcon,
  WdIconField,
  WdInplace,
  WdInput,
  WdInputColor,
  WdInputGroup,
  WdInputGroupAddon,
  WdInputNumber,
  WdInputOtp,
  WdInputPassword,
  WdInputTags,
  WdKnob,
  WdLabel,
  WdLayout,
  WdLayoutContent,
  WdLayoutFooter,
  WdLayoutHeader,
  WdLayoutSider,
  WdListbox,
  WdMegaMenu,
  WdMenu,
  WdMenubar,
  WdMessage,
  WdMeterGroup,
  WdOrderList,
  WdPagination,
  WdPanel,
  WdPickList,
  WdPopover,
  WdProgressBar,
  WdProgressSpinner,
  WdRadio,
  WdRadioGroup,
  WdRating,
  WdScrollbar,
  WdScrollTop,
  WdSelect,
  WdSelectButton,
  WdSidebar,
  WdSkeleton,
  WdSlider,
  WdSpace,
  WdSpeedDial,
  WdSplitButton,
  WdSplitter,
  WdStepper,
  WdSwitch,
  WdTable,
  WdTabs,
  WdTag,
  WdTerminal,
  WdTextarea,
  WdTieredMenu,
  WdTimeline,
  WdToast,
  WdToggleButton,
  WdToolbar,
  WdTooltip,
  WdTree,
  WdTreeSelect,
  WdTreeTable,
  WdVirtualScroller,
}

export const wdComponentNames = Object.keys(wdComponents)
