import type { Component } from 'vue'
import MAccordion from './components/Accordion/Accordion.vue'
import MAffix from './components/Affix/Affix.vue'
import MAlert from './components/Alert/Alert.vue'
import MAnchor from './components/Anchor/Anchor.vue'
import MAnchorLink from './components/Anchor/AnchorLink.vue'
import MAutoComplete from './components/AutoComplete/AutoComplete.vue'
import MAvatar from './components/Avatar/Avatar.vue'
import MAvatarGroup from './components/Avatar/AvatarGroup.vue'
import MBadge from './components/Badge/Badge.vue'
import MBlockUI from './components/BlockUI/BlockUI.vue'
import MBreadcrumb from './components/Breadcrumb/Breadcrumb.vue'
import MButton from './components/Button/Button.vue'
import MButtonGroup from './components/Button/ButtonGroup.vue'
import MCard from './components/Card/Card.vue'
import MCalendar from './components/Calendar/Calendar.vue'
import MCarousel from './components/Carousel/Carousel.vue'
import MCascadeSelect from './components/CascadeSelect/CascadeSelect.vue'
import MCheckbox from './components/Checkbox/Checkbox.vue'
import MCheckboxGroup from './components/Checkbox/CheckboxGroup.vue'
import MChip from './components/Chip/Chip.vue'
import MCommandMenu from './components/CommandMenu/CommandMenu.vue'
import MConfigProvider from './components/ConfigProvider/ConfigProvider.vue'
import MConfirmDialog from './components/ConfirmDialog/ConfirmDialog.vue'
import MConfirmPopup from './components/ConfirmPopup/ConfirmPopup.vue'
import MContextMenu from './components/ContextMenu/ContextMenu.vue'
import MDataView from './components/DataView/DataView.vue'
import MDatePicker from './components/DatePicker/DatePicker.vue'
import MDescriptions from './components/Descriptions/Descriptions.vue'
import MDescriptionsItem from './components/Descriptions/DescriptionsItem.vue'
import MDialog from './components/Dialog/Dialog.vue'
import MDivider from './components/Divider/Divider.vue'
import MDock from './components/Dock/Dock.vue'
import MDrawer from './components/Drawer/Drawer.vue'
import MDropdown from './components/Dropdown/Dropdown.vue'
import MEmpty from './components/Empty/Empty.vue'
import MFieldset from './components/Fieldset/Fieldset.vue'
import MFileUpload from './components/FileUpload/FileUpload.vue'
import MFlex from './components/Flex/Flex.vue'
import MFloatLabel from './components/FloatLabel/FloatLabel.vue'
import MFluid from './components/Fluid/Fluid.vue'
import MForm from './components/Form/Form.vue'
import MFormItem from './components/Form/FormItem.vue'
import MGallery from './components/Gallery/Gallery.vue'
import MGrid from './components/Grid/Grid.vue'
import MGi from './components/Grid/GridItem.vue'
import MGridItem from './components/Grid/GridItem.vue'
import MIcon from './components/Icon/Icon.vue'
import MIconField from './components/IconField/IconField.vue'
import MImage from './components/Image/Image.vue'
import MImagePreviewGroup from './components/Image/ImagePreviewGroup.vue'
import MInplace from './components/Inplace/Inplace.vue'
import MInput from './components/Input/Input.vue'
import MInputColor from './components/InputColor/InputColor.vue'
import MInputGroup from './components/InputGroup/InputGroup.vue'
import MInputGroupAddon from './components/InputGroup/InputGroupAddon.vue'
import MInputNumber from './components/InputNumber/InputNumber.vue'
import MInputOtp from './components/InputOtp/InputOtp.vue'
import MInputPassword from './components/InputPassword/InputPassword.vue'
import MInputTags from './components/InputTags/InputTags.vue'
import MKnob from './components/Knob/Knob.vue'
import MLabel from './components/Label/Label.vue'
import MLayout from './components/Layout/Layout.vue'
import MLayoutContent from './components/Layout/LayoutContent.vue'
import MLayoutFooter from './components/Layout/LayoutFooter.vue'
import MLayoutHeader from './components/Layout/LayoutHeader.vue'
import MLayoutSider from './components/Layout/LayoutSider.vue'
import MList from './components/List/List.vue'
import MListItem from './components/List/ListItem.vue'
import MListItemMeta from './components/List/ListItemMeta.vue'
import MListbox from './components/Listbox/Listbox.vue'
import MLoading from './components/Loading/Loading.vue'
import MMegaMenu from './components/MegaMenu/MegaMenu.vue'
import MMentions from './components/Mentions/Mentions.vue'
import MMenu from './components/Menu/Menu.vue'
import MMenubar from './components/Menubar/Menubar.vue'
import MMessage from './components/Message/Message.vue'
import MMeterGroup from './components/MeterGroup/MeterGroup.vue'
import MOrderList from './components/OrderList/OrderList.vue'
import MPagination from './components/Pagination/Pagination.vue'
import MPanel from './components/Panel/Panel.vue'
import MPickList from './components/PickList/PickList.vue'
import MPopover from './components/Popover/Popover.vue'
import MProgressBar from './components/ProgressBar/ProgressBar.vue'
import MProgressSpinner from './components/ProgressSpinner/ProgressSpinner.vue'
import MQRCode from './components/QRCode/QRCode.vue'
import MRadio from './components/Radio/Radio.vue'
import MRadioGroup from './components/Radio/RadioGroup.vue'
import MRating from './components/Rating/Rating.vue'
import MResult from './components/Result/Result.vue'
import MScrollbar from './components/Scrollbar/Scrollbar.vue'
import MScrollTop from './components/ScrollTop/ScrollTop.vue'
import MSegmented from './components/Segmented/Segmented.vue'
import MSelect from './components/Select/Select.vue'
import MSelectButton from './components/SelectButton/SelectButton.vue'
import MSidebar from './components/Sidebar/Sidebar.vue'
import MSkeleton from './components/Skeleton/Skeleton.vue'
import MSlider from './components/Slider/Slider.vue'
import MSpace from './components/Space/Space.vue'
import MSpeedDial from './components/SpeedDial/SpeedDial.vue'
import MSplitButton from './components/SplitButton/SplitButton.vue'
import MSplitter from './components/Splitter/Splitter.vue'
import MStatistic from './components/Statistic/Statistic.vue'
import MStatisticCountdown from './components/Statistic/StatisticCountdown.vue'
import MStatus from './components/Status/Status.vue'
import MStepper from './components/Stepper/Stepper.vue'
import MSwitch from './components/Switch/Switch.vue'
import MTable from './components/Table/Table.vue'
import MTabs from './components/Tabs/Tabs.vue'
import MTag from './components/Tag/Tag.vue'
import MTerminal from './components/Terminal/Terminal.vue'
import MTextarea from './components/Textarea/Textarea.vue'
import MTieredMenu from './components/TieredMenu/TieredMenu.vue'
import MTimeline from './components/Timeline/Timeline.vue'
import MToast from './components/Toast/Toast.vue'
import { MLink, MParagraph, MText, MTitle, MTypography } from './components/Typography'
import MToggleButton from './components/ToggleButton/ToggleButton.vue'
import MTour from './components/Tour/Tour.vue'
import MToolbar from './components/Toolbar/Toolbar.vue'
import MTooltip from './components/Tooltip/Tooltip.vue'
import MTree from './components/Tree/Tree.vue'
import MTreeSelect from './components/TreeSelect/TreeSelect.vue'
import MVirtualScroller from './components/VirtualScroller/VirtualScroller.vue'
import MWatermark from './components/Watermark/Watermark.vue'

/** Public components available for global registration (`app.use`). */
export const mComponents: Record<string, Component> = {
  MAccordion,
  MAffix,
  MAlert,
  MAnchor,
  MAnchorLink,
  MAutoComplete,
  MAvatar,
  MAvatarGroup,
  MBadge,
  MBlockUI,
  MBreadcrumb,
  MButton,
  MButtonGroup,
  MCard,
  MCalendar,
  MCarousel,
  MCascadeSelect,
  MCheckbox,
  MCheckboxGroup,
  MChip,
  MCommandMenu,
  MConfigProvider,
  MConfirmDialog,
  MConfirmPopup,
  MContextMenu,
  MDataView,
  MDatePicker,
  MDescriptions,
  MDescriptionsItem,
  MDialog,
  MDivider,
  MDock,
  MDrawer,
  MDropdown,
  MEmpty,
  MFieldset,
  MFileUpload,
  MFlex,
  MFloatLabel,
  MFluid,
  MForm,
  MFormItem,
  MGallery,
  MGi,
  MGrid,
  MGridItem,
  MIcon,
  MIconField,
  MImage,
  MImagePreviewGroup,
  MInplace,
  MInput,
  MInputColor,
  MInputGroup,
  MInputGroupAddon,
  MInputNumber,
  MInputOtp,
  MInputPassword,
  MInputTags,
  MKnob,
  MLabel,
  MLayout,
  MLayoutContent,
  MLayoutFooter,
  MLayoutHeader,
  MLayoutSider,
  MLink,
  MList,
  MListItem,
  MListItemMeta,
  MListbox,
  MLoading,
  MMegaMenu,
  MMentions,
  MMenu,
  MMenubar,
  MMessage,
  MMeterGroup,
  MOrderList,
  MPagination,
  MPanel,
  MParagraph,
  MPickList,
  MPopover,
  MProgressBar,
  MProgressSpinner,
  MQRCode,
  MRadio,
  MRadioGroup,
  MRating,
  MResult,
  MScrollbar,
  MScrollTop,
  MSegmented,
  MSelect,
  MSelectButton,
  MSidebar,
  MSkeleton,
  MSlider,
  MSpace,
  MSpeedDial,
  MSplitButton,
  MSplitter,
  MStatistic,
  MStatisticCountdown,
  MStatus,
  MStepper,
  MSwitch,
  MTable,
  MTabs,
  MTag,
  MTerminal,
  MText,
  MTextarea,
  MTieredMenu,
  MTimeline,
  MTitle,
  MToast,
  MToggleButton,
  MTour,
  MToolbar,
  MTooltip,
  MTree,
  MTreeSelect,
  MTypography,
  MVirtualScroller,
  MWatermark,
}

export const mComponentNames = Object.keys(mComponents)
