import type { Component } from 'vue'
import RdAccordion from './components/Accordion/Accordion.vue'
import RdAutoComplete from './components/AutoComplete/AutoComplete.vue'
import RdAvatar from './components/Avatar/Avatar.vue'
import RdAvatarGroup from './components/Avatar/AvatarGroup.vue'
import RdBadge from './components/Badge/Badge.vue'
import RdBlockUI from './components/BlockUI/BlockUI.vue'
import RdBreadcrumb from './components/Breadcrumb/Breadcrumb.vue'
import RdButton from './components/Button/Button.vue'
import RdButtonGroup from './components/Button/ButtonGroup.vue'
import RdCard from './components/Card/Card.vue'
import RdCarousel from './components/Carousel/Carousel.vue'
import RdCascadeSelect from './components/CascadeSelect/CascadeSelect.vue'
import RdCheckbox from './components/Checkbox/Checkbox.vue'
import RdCheckboxGroup from './components/Checkbox/CheckboxGroup.vue'
import RdChip from './components/Chip/Chip.vue'
import RdCommandMenu from './components/CommandMenu/CommandMenu.vue'
import RdConfigProvider from './components/ConfigProvider/ConfigProvider.vue'
import RdConfirmDialog from './components/ConfirmDialog/ConfirmDialog.vue'
import RdConfirmPopup from './components/ConfirmPopup/ConfirmPopup.vue'
import RdContextMenu from './components/ContextMenu/ContextMenu.vue'
import RdDataView from './components/DataView/DataView.vue'
import RdDatePicker from './components/DatePicker/DatePicker.vue'
import RdDialog from './components/Dialog/Dialog.vue'
import RdDivider from './components/Divider/Divider.vue'
import RdDock from './components/Dock/Dock.vue'
import RdDrawer from './components/Drawer/Drawer.vue'
import RdDropdown from './components/Dropdown/Dropdown.vue'
import RdFieldset from './components/Fieldset/Fieldset.vue'
import RdFileUpload from './components/FileUpload/FileUpload.vue'
import RdFlex from './components/Flex/Flex.vue'
import RdFloatLabel from './components/FloatLabel/FloatLabel.vue'
import RdFluid from './components/Fluid/Fluid.vue'
import RdForm from './components/Form/Form.vue'
import RdFormItem from './components/Form/FormItem.vue'
import RdGallery from './components/Gallery/Gallery.vue'
import RdGrid from './components/Grid/Grid.vue'
import RdGi from './components/Grid/GridItem.vue'
import RdGridItem from './components/Grid/GridItem.vue'
import RdIcon from './components/Icon/Icon.vue'
import RdIconField from './components/IconField/IconField.vue'
import RdInplace from './components/Inplace/Inplace.vue'
import RdInput from './components/Input/Input.vue'
import RdInputColor from './components/InputColor/InputColor.vue'
import RdInputGroup from './components/InputGroup/InputGroup.vue'
import RdInputGroupAddon from './components/InputGroup/InputGroupAddon.vue'
import RdInputNumber from './components/InputNumber/InputNumber.vue'
import RdInputOtp from './components/InputOtp/InputOtp.vue'
import RdInputPassword from './components/InputPassword/InputPassword.vue'
import RdInputTags from './components/InputTags/InputTags.vue'
import RdKnob from './components/Knob/Knob.vue'
import RdLabel from './components/Label/Label.vue'
import RdLayout from './components/Layout/Layout.vue'
import RdLayoutContent from './components/Layout/LayoutContent.vue'
import RdLayoutFooter from './components/Layout/LayoutFooter.vue'
import RdLayoutHeader from './components/Layout/LayoutHeader.vue'
import RdLayoutSider from './components/Layout/LayoutSider.vue'
import RdListbox from './components/Listbox/Listbox.vue'
import RdMegaMenu from './components/MegaMenu/MegaMenu.vue'
import RdMenu from './components/Menu/Menu.vue'
import RdMenubar from './components/Menubar/Menubar.vue'
import RdMessage from './components/Message/Message.vue'
import RdMeterGroup from './components/MeterGroup/MeterGroup.vue'
import RdOrderList from './components/OrderList/OrderList.vue'
import RdPagination from './components/Pagination/Pagination.vue'
import RdPanel from './components/Panel/Panel.vue'
import RdPickList from './components/PickList/PickList.vue'
import RdPopover from './components/Popover/Popover.vue'
import RdProgressBar from './components/ProgressBar/ProgressBar.vue'
import RdProgressSpinner from './components/ProgressSpinner/ProgressSpinner.vue'
import RdRadio from './components/Radio/Radio.vue'
import RdRadioGroup from './components/Radio/RadioGroup.vue'
import RdRating from './components/Rating/Rating.vue'
import RdScrollbar from './components/Scrollbar/Scrollbar.vue'
import RdScrollTop from './components/ScrollTop/ScrollTop.vue'
import RdSelect from './components/Select/Select.vue'
import RdSelectButton from './components/SelectButton/SelectButton.vue'
import RdSidebar from './components/Sidebar/Sidebar.vue'
import RdSkeleton from './components/Skeleton/Skeleton.vue'
import RdSlider from './components/Slider/Slider.vue'
import RdSpace from './components/Space/Space.vue'
import RdSpeedDial from './components/SpeedDial/SpeedDial.vue'
import RdSplitButton from './components/SplitButton/SplitButton.vue'
import RdSplitter from './components/Splitter/Splitter.vue'
import RdStepper from './components/Stepper/Stepper.vue'
import RdSwitch from './components/Switch/Switch.vue'
import RdTable from './components/Table/Table.vue'
import RdTabs from './components/Tabs/Tabs.vue'
import RdTag from './components/Tag/Tag.vue'
import RdTerminal from './components/Terminal/Terminal.vue'
import RdTextarea from './components/Textarea/Textarea.vue'
import RdTieredMenu from './components/TieredMenu/TieredMenu.vue'
import RdTimeline from './components/Timeline/Timeline.vue'
import RdToast from './components/Toast/Toast.vue'
import RdToggleButton from './components/ToggleButton/ToggleButton.vue'
import RdToolbar from './components/Toolbar/Toolbar.vue'
import RdTooltip from './components/Tooltip/Tooltip.vue'
import RdTree from './components/Tree/Tree.vue'
import RdTreeSelect from './components/TreeSelect/TreeSelect.vue'
import RdTreeTable from './components/TreeTable/TreeTable.vue'
import RdVirtualScroller from './components/VirtualScroller/VirtualScroller.vue'

/** Public components available for global registration (`app.use`). */
export const rdComponents: Record<string, Component> = {
  RdAccordion,
  RdAutoComplete,
  RdAvatar,
  RdAvatarGroup,
  RdBadge,
  RdBlockUI,
  RdBreadcrumb,
  RdButton,
  RdButtonGroup,
  RdCard,
  RdCarousel,
  RdCascadeSelect,
  RdCheckbox,
  RdCheckboxGroup,
  RdChip,
  RdCommandMenu,
  RdConfigProvider,
  RdConfirmDialog,
  RdConfirmPopup,
  RdContextMenu,
  RdDataView,
  RdDatePicker,
  RdDialog,
  RdDivider,
  RdDock,
  RdDrawer,
  RdDropdown,
  RdFieldset,
  RdFileUpload,
  RdFlex,
  RdFloatLabel,
  RdFluid,
  RdForm,
  RdFormItem,
  RdGallery,
  RdGi,
  RdGrid,
  RdGridItem,
  RdIcon,
  RdIconField,
  RdInplace,
  RdInput,
  RdInputColor,
  RdInputGroup,
  RdInputGroupAddon,
  RdInputNumber,
  RdInputOtp,
  RdInputPassword,
  RdInputTags,
  RdKnob,
  RdLabel,
  RdLayout,
  RdLayoutContent,
  RdLayoutFooter,
  RdLayoutHeader,
  RdLayoutSider,
  RdListbox,
  RdMegaMenu,
  RdMenu,
  RdMenubar,
  RdMessage,
  RdMeterGroup,
  RdOrderList,
  RdPagination,
  RdPanel,
  RdPickList,
  RdPopover,
  RdProgressBar,
  RdProgressSpinner,
  RdRadio,
  RdRadioGroup,
  RdRating,
  RdScrollbar,
  RdScrollTop,
  RdSelect,
  RdSelectButton,
  RdSidebar,
  RdSkeleton,
  RdSlider,
  RdSpace,
  RdSpeedDial,
  RdSplitButton,
  RdSplitter,
  RdStepper,
  RdSwitch,
  RdTable,
  RdTabs,
  RdTag,
  RdTerminal,
  RdTextarea,
  RdTieredMenu,
  RdTimeline,
  RdToast,
  RdToggleButton,
  RdToolbar,
  RdTooltip,
  RdTree,
  RdTreeSelect,
  RdTreeTable,
  RdVirtualScroller,
}

export const rdComponentNames = Object.keys(rdComponents)
