// Evaluate the registry before the individual component re-exports.
import './component-registry'

export { default as WiButton } from './components/Button/Button.vue'
export { default as WiButtonGroup } from './components/Button/ButtonGroup.vue'
export type {
  ButtonBadgeSeverity,
  ButtonEmits,
  ButtonGroupProps,
  ButtonIconPos,
  ButtonInstance,
  ButtonProps,
  ButtonSeverity,
  ButtonSize,
  ButtonVariant,
} from './components/Button/types'
export { default as WiCard } from './components/Card/Card.vue'
export type { CardProps, CardSize } from './components/Card/types'
export { default as WiDialog } from './components/Dialog/Dialog.vue'
export type { DialogCloseGuard, DialogClickGuard, DialogEmits, DialogPosition, DialogProps, DialogType } from './components/Dialog/types'
export { default as WiDropdown } from './components/Dropdown/Dropdown.vue'
export type { DropdownEmits, DropdownItem, DropdownItemType, DropdownProps, DropdownTrigger } from './components/Dropdown/types'
export { default as WiIcon } from './components/Icon/Icon.vue'
export {
  getIconDefinition,
  iconNames,
  iconRegistry,
  isIconName,
} from './components/Icon/icons'
export type { IconDefinition, IconName, IconPrimitive } from './components/Icon/icons'
export type { IconProps, IconSize } from './components/Icon/types'
export { default as WiInput } from './components/Input/Input.vue'
export type { InputEmits, InputProps } from './components/Input/types'
export { default as WiCheckbox } from './components/Checkbox/Checkbox.vue'
export { default as WiCheckboxGroup } from './components/Checkbox/CheckboxGroup.vue'
export type {
  CheckboxEmits,
  CheckboxGroupEmits,
  CheckboxGroupProps,
  CheckboxProps,
  CheckboxSize,
  CheckboxValue,
} from './components/Checkbox/types'
export { default as WiRadio } from './components/Radio/Radio.vue'
export { default as WiRadioGroup } from './components/Radio/RadioGroup.vue'
export type {
  RadioEmits,
  RadioGroupEmits,
  RadioGroupProps,
  RadioProps,
  RadioSize,
  RadioValue,
} from './components/Radio/types'
export { default as WiSwitch } from './components/Switch/Switch.vue'
export type { SwitchEmits, SwitchProps, SwitchSize } from './components/Switch/types'
export { default as WiTextarea } from './components/Textarea/Textarea.vue'
export type { TextareaEmits, TextareaInstance, TextareaProps, WiTextareaAutosize } from './components/Textarea/types'
export { default as WiSelect } from './components/Select/Select.vue'
export type { SelectEmits, SelectModelValue, SelectOption, SelectProps, SelectSize, SelectValue } from './components/Select/types'
export { default as WiTabs } from './components/Tabs/Tabs.vue'
export type { TabItem, TabsEmits, TabsProps, TabsType } from './components/Tabs/types'
export { default as WiDivider } from './components/Divider/Divider.vue'
export type { DividerAlign, DividerLayout, DividerProps, DividerType } from './components/Divider/types'
export { default as WiTag } from './components/Tag/Tag.vue'
export type { TagEmits, TagProps, TagSeverity, TagSize } from './components/Tag/types'
export { default as WiTooltip } from './components/Tooltip/Tooltip.vue'
export type { TooltipProps } from './components/Tooltip/types'
export { default as WiToast } from './components/Toast/Toast.vue'
export { toast, useToast } from './components/Toast/toast'
export type {
  ToastEmits,
  ToastHandle,
  ToastInput,
  ToastMessage,
  ToastOptions,
  ToastPosition,
  ToastProps,
  ToastSeverity,
} from './components/Toast/types'
export { default as WiTable } from './components/Table/Table.vue'
export type {
  TableColumn,
  TableColumnFilterOption,
  TableEmits,
  TableFilters,
  TableFixed,
  TableProps,
  TableSelectionMode,
  TableSize,
  TableSortMode,
  TableSortOrder,
} from './components/Table/types'
export { default as WiPagination } from './components/Pagination/Pagination.vue'
export type { PaginationEmits, PaginationInstance, PaginationProps } from './components/Pagination/types'
export { default as WiScrollbar } from './components/Scrollbar/Scrollbar.vue'
export type {
  ScrollbarAriaOrientation,
  ScrollbarDirection,
  ScrollbarEmits,
  ScrollbarInstance,
  ScrollbarProps,
  ScrollbarScrollPayload,
} from './components/Scrollbar/types'
export { default as WiDrawer } from './components/Drawer/Drawer.vue'
export type { DrawerEmits, DrawerPosition, DrawerProps } from './components/Drawer/types'
export { default as WiPopover } from './components/Popover/Popover.vue'
export type { PopoverEmits, PopoverPlacement, PopoverProps, PopoverTrigger } from './components/Popover/types'
export { default as WiAccordion } from './components/Accordion/Accordion.vue'
export type { AccordionEmits, AccordionProps, AccordionTab } from './components/Accordion/types'
export { default as WiBadge } from './components/Badge/Badge.vue'
export type { BadgeOffset, BadgeProps, BadgeSeverity, BadgeSize } from './components/Badge/types'
export { default as WiMessage } from './components/Message/Message.vue'
export { message, useMessage } from './components/Message/message'
export type {
  MessageHandle,
  MessageHostConfig,
  MessageInput,
  MessageItem,
  MessageOptions,
  MessagePlacement,
  MessageProps,
  MessageSeverity,
} from './components/Message/types'
export type { WiRenderable } from './shared/content'
export { default as WiSkeleton } from './components/Skeleton/Skeleton.vue'
export type { SkeletonAnimation, SkeletonProps, SkeletonShape } from './components/Skeleton/types'
export { default as WiAvatar } from './components/Avatar/Avatar.vue'
export { default as WiAvatarGroup } from './components/Avatar/AvatarGroup.vue'
export type { AvatarEmits, AvatarGroupProps, AvatarProps, AvatarShape, AvatarSize } from './components/Avatar/types'
export { default as WiChip } from './components/Chip/Chip.vue'
export type { ChipEmits, ChipProps, ChipSeverity, ChipSize } from './components/Chip/types'
export { default as WiProgressBar } from './components/ProgressBar/ProgressBar.vue'
export type { ProgressBarMode, ProgressBarProps, ProgressBarStatus, ProgressBarType } from './components/ProgressBar/types'
export { default as WiProgressSpinner } from './components/ProgressSpinner/ProgressSpinner.vue'
export type { ProgressSpinnerProps } from './components/ProgressSpinner/types'
export { default as WiInputNumber } from './components/InputNumber/InputNumber.vue'
export type { InputNumberButtonPlacement, InputNumberEmits, InputNumberProps } from './components/InputNumber/types'
export { default as WiInputPassword } from './components/InputPassword/InputPassword.vue'
export type {
  InputPasswordEmits,
  InputPasswordProps,
  InputPasswordSlots,
  PasswordStrength,
  WiShowPasswordOn,
} from './components/InputPassword/types'
export { default as WiFloatLabel } from './components/FloatLabel/FloatLabel.vue'
export type { FloatLabelProps } from './components/FloatLabel/types'
export { default as WiIconField } from './components/IconField/IconField.vue'
export type { IconFieldProps } from './components/IconField/types'
export { default as WiInputGroup } from './components/InputGroup/InputGroup.vue'
export { default as WiInputGroupAddon } from './components/InputGroup/InputGroupAddon.vue'
export type { InputGroupAddonProps, InputGroupProps } from './components/InputGroup/types'
export { default as WiSelectButton } from './components/SelectButton/SelectButton.vue'
export type {
  SelectButtonEmits,
  SelectButtonOption,
  SelectButtonProps,
  SelectButtonValue,
} from './components/SelectButton/types'
export { default as WiSlider } from './components/Slider/Slider.vue'
export type { SliderEmits, SliderMarks, SliderProps } from './components/Slider/types'
export { default as WiRating } from './components/Rating/Rating.vue'
export type { RatingEmits, RatingProps } from './components/Rating/types'
export { default as WiBreadcrumb } from './components/Breadcrumb/Breadcrumb.vue'
export type { BreadcrumbHome, BreadcrumbItem, BreadcrumbProps } from './components/Breadcrumb/types'
export { default as WiPanel } from './components/Panel/Panel.vue'
export type { PanelEmits, PanelProps, PanelSize } from './components/Panel/types'
export { default as WiFieldset } from './components/Fieldset/Fieldset.vue'
export type { FieldsetEmits, FieldsetProps } from './components/Fieldset/types'
export { default as WiFlex } from './components/Flex/Flex.vue'
export type { FlexAlign, FlexJustify, FlexProps, FlexSize } from './components/Flex/types'
export { default as WiSpace } from './components/Space/Space.vue'
export type { SpaceAlign, SpaceJustify, SpaceProps, SpaceSize } from './components/Space/types'
export { default as WiGrid } from './components/Grid/Grid.vue'
export { default as WiGridItem } from './components/Grid/GridItem.vue'
export { default as WiGi } from './components/Grid/GridItem.vue'
export type { GridItemProps, GridProps, GridResponsive } from './components/Grid/types'
export { WI_GRID_KEY } from './components/Grid/types'
export { default as WiLayout } from './components/Layout/Layout.vue'
export { default as WiLayoutHeader } from './components/Layout/LayoutHeader.vue'
export { default as WiLayoutContent } from './components/Layout/LayoutContent.vue'
export { default as WiLayoutFooter } from './components/Layout/LayoutFooter.vue'
export { default as WiLayoutSider } from './components/Layout/LayoutSider.vue'
export type {
  LayoutCollapseMode,
  LayoutContentProps,
  LayoutExpose,
  LayoutFooterProps,
  LayoutHeaderProps,
  LayoutPosition,
  LayoutProps,
  LayoutSiderEmits,
  LayoutSiderPlacement,
  LayoutSiderProps,
  LayoutTrigger,
} from './components/Layout/types'
export { WI_LAYOUT_KEY } from './components/Layout/context'
export { default as WiSplitter } from './components/Splitter/Splitter.vue'
export type { SplitterEmits, SplitterLayout, SplitterProps, SplitterSize } from './components/Splitter/types'
export { default as WiStepper } from './components/Stepper/Stepper.vue'
export type { StepperEmits, StepperOrientation, StepperProps, StepperStatus, StepperStep } from './components/Stepper/types'
export { default as WiToolbar } from './components/Toolbar/Toolbar.vue'
export type { ToolbarProps } from './components/Toolbar/types'
export { default as WiMenu } from './components/Menu/Menu.vue'
export type { MenuEmits, MenuItem, MenuProps } from './components/Menu/types'
export { default as WiMenubar } from './components/Menubar/Menubar.vue'
export type { MenubarEmits, MenubarItem, MenubarProps } from './components/Menubar/types'
export { default as WiContextMenu } from './components/ContextMenu/ContextMenu.vue'
export { useContextMenu } from './components/ContextMenu/useContextMenu'
export type {
  ContextMenuEmits,
  ContextMenuInstance,
  ContextMenuItem,
  ContextMenuPosition,
  ContextMenuProps,
} from './components/ContextMenu/types'
export { default as WiTieredMenu } from './components/TieredMenu/TieredMenu.vue'
export type { TieredMenuEmits, TieredMenuItem, TieredMenuProps } from './components/TieredMenu/types'
export { default as WiConfirmDialog } from './components/ConfirmDialog/ConfirmDialog.vue'
export type { ConfirmDialogEmits, ConfirmDialogProps } from './components/ConfirmDialog/types'
export { default as WiDatePicker } from './components/DatePicker/DatePicker.vue'
export type {
  DatePickerDateValue,
  DatePickerEmits,
  DatePickerModel,
  DatePickerProps,
  DatePickerShortcut,
  DatePickerType,
  DatePickerValue,
} from './components/DatePicker/types'
export { default as WiListbox } from './components/Listbox/Listbox.vue'
export type { ListboxEmits, ListboxOption, ListboxProps, ListboxValue } from './components/Listbox/types'
export { default as WiToggleButton } from './components/ToggleButton/ToggleButton.vue'
export type { ToggleButtonEmits, ToggleButtonProps } from './components/ToggleButton/types'
export { default as WiInputOtp } from './components/InputOtp/InputOtp.vue'
export type { InputOtpEmits, InputOtpProps } from './components/InputOtp/types'
export { default as WiKnob } from './components/Knob/Knob.vue'
export type { KnobEmits, KnobProps } from './components/Knob/types'
export { default as WiAutoComplete } from './components/AutoComplete/AutoComplete.vue'
export type {
  AutoCompleteEmits,
  AutoCompleteOption,
  AutoCompleteProps,
  AutoCompleteSuggestion,
} from './components/AutoComplete/types'
export { default as WiSplitButton } from './components/SplitButton/SplitButton.vue'
export type { SplitButtonEmits, SplitButtonItem, SplitButtonProps } from './components/SplitButton/types'
export { default as WiTree } from './components/Tree/Tree.vue'
export type {
  TreeCheckStrategy,
  TreeCheckedKeys,
  TreeEmits,
  TreeExpandedKeys,
  TreeNode,
  TreeProps,
  TreeSelectionKeys,
  TreeSelectionMode,
} from './components/Tree/types'
export { default as WiTimeline } from './components/Timeline/Timeline.vue'
export type { TimelineAlign, TimelineEvent, TimelineLayout, TimelineProps, TimelineSeverity } from './components/Timeline/types'
export { default as WiDataView } from './components/DataView/DataView.vue'
export type { DataViewLayout, DataViewProps } from './components/DataView/types'
export { default as WiConfirmPopup } from './components/ConfirmPopup/ConfirmPopup.vue'
export type { ConfirmPopupEmits, ConfirmPopupPlacement, ConfirmPopupProps } from './components/ConfirmPopup/types'
export { default as WiScrollTop } from './components/ScrollTop/ScrollTop.vue'
export type { ScrollTopProps, ScrollTopTarget } from './components/ScrollTop/types'
export { default as WiBlockUI } from './components/BlockUI/BlockUI.vue'
export type { BlockUIProps } from './components/BlockUI/types'
export { default as WiInplace } from './components/Inplace/Inplace.vue'
export type { InplaceEmits, InplaceProps } from './components/Inplace/types'
export { default as WiCascadeSelect } from './components/CascadeSelect/CascadeSelect.vue'
export type {
  CascadeSelectEmits,
  CascadeSelectOption,
  CascadeSelectProps,
  CascadeSelectValue,
} from './components/CascadeSelect/types'
export { default as WiTreeSelect } from './components/TreeSelect/TreeSelect.vue'
export type { TreeSelectEmits, TreeSelectNode, TreeSelectProps, TreeSelectValue } from './components/TreeSelect/types'
export { default as WiInputColor } from './components/InputColor/InputColor.vue'
export type { InputColorEmits, InputColorProps } from './components/InputColor/types'
export { default as WiInputTags } from './components/InputTags/InputTags.vue'
export type { InputTagsEmits, InputTagsProps } from './components/InputTags/types'
export { default as WiLabel } from './components/Label/Label.vue'
export type { LabelProps } from './components/Label/types'
export { default as WiSpeedDial } from './components/SpeedDial/SpeedDial.vue'
export type {
  SpeedDialDirection,
  SpeedDialEmits,
  SpeedDialItem,
  SpeedDialProps,
} from './components/SpeedDial/types'
export { default as WiOrderList } from './components/OrderList/OrderList.vue'
export type { OrderListEmits, OrderListProps } from './components/OrderList/types'
export { default as WiPickList } from './components/PickList/PickList.vue'
export type { PickListEmits, PickListProps } from './components/PickList/types'
export { default as WiVirtualScroller } from './components/VirtualScroller/VirtualScroller.vue'
export type {
  VirtualScrollerItemSlotProps,
  VirtualScrollerProps,
} from './components/VirtualScroller/types'
export { default as WiTreeTable } from './components/TreeTable/TreeTable.vue'
export type {
  TreeTableColumn,
  TreeTableEmits,
  TreeTableNode,
  TreeTableProps,
} from './components/TreeTable/types'
export { default as WiMegaMenu } from './components/MegaMenu/MegaMenu.vue'
export type { MegaMenuItem, MegaMenuProps } from './components/MegaMenu/types'
export { default as WiDock } from './components/Dock/Dock.vue'
export type { DockItem, DockProps } from './components/Dock/types'
export { default as WiSidebar } from './components/Sidebar/Sidebar.vue'
export type { SidebarItem, SidebarProps } from './components/Sidebar/types'
export { default as WiCommandMenu } from './components/CommandMenu/CommandMenu.vue'
export type {
  CommandMenuEmits,
  CommandMenuItem,
  CommandMenuProps,
} from './components/CommandMenu/types'
export { default as WiFileUpload } from './components/FileUpload/FileUpload.vue'
export type {
  FileUploadEmits,
  FileUploadExpose,
  FileUploadFile,
  FileUploadInstance,
  FileUploadListType,
  FileUploadMode,
  FileUploadProps,
  FileUploadRequestOptions,
  FileUploadSlots,
  FileUploadStatus,
} from './components/FileUpload/types'
export { default as WiCarousel } from './components/Carousel/Carousel.vue'
export type { CarouselEmits, CarouselProps } from './components/Carousel/types'
export { default as WiGallery } from './components/Gallery/Gallery.vue'
export type { GalleryEmits, GalleryProps } from './components/Gallery/types'
export { default as WiMeterGroup } from './components/MeterGroup/MeterGroup.vue'
export type { MeterGroupItem, MeterGroupProps } from './components/MeterGroup/types'
export { default as WiFluid } from './components/Fluid/Fluid.vue'
export type { FluidProps } from './components/Fluid/types'
export { default as WiTerminal } from './components/Terminal/Terminal.vue'
export type { TerminalEmits, TerminalProps } from './components/Terminal/types'

export { default as WiForm } from './components/Form/Form.vue'
export { default as WiFormItem } from './components/Form/FormItem.vue'
export type {
  FormInstance,
  FormItemProps,
  FormItemRule,
  FormLabelAlign,
  FormLabelPosition,
  FormModel,
  FormProps,
  FormRules,
  FormValidateResult,
  FormValidateTrigger,
} from './components/Form/types'
export { WI_FORM_ERRORS_KEY, WI_FORM_KEY } from './components/Form/context'
export type { FormFieldValidator, WiFormContext, WiFormFieldRegistration } from './components/Form/context'

export { default as WiConfigProvider } from './components/ConfigProvider/ConfigProvider.vue'
export type { WiGlobalConfig, WiLocaleConfig, WiDensity, WiComponentDefaults } from './components/ConfigProvider/types'
export {
  createWellInsight,
  getDefaultWiConfig,
  getComponentDefault,
  getComponentDefaults,
  installWellInsight,
  mergeComponentDefaults,
  mergeWiConfig,
  provideWiConfig,
  resolveConfiguredAppendTo,
  useComponentDefaults,
  useConfiguredGapSize,
  useConfiguredSize,
  useConfiguredVariant,
  useWiConfig,
  WellInsight,
  WI_CONFIG_KEY,
} from './shared/config'
export type { WiInstallerOptions } from './shared/config'
export type { WiComponentDefaultMap } from './shared/componentDefaults'
export { wiComponentNames, wiComponents } from './component-registry'
export { WellInsight as default } from './shared/config'
export { enUS, formatLocale, mergeLocale, useWiLocale, zhCN } from './locale'
export type { WiLocaleMessages, WiLocaleName } from './locale'
export type {
  WiInputVariant,
  WiSeverity,
  WiSize,
  WiSizeInput,
  WiTagSeverity,
  WiToastSeverity,
} from './shared/types'
export { normalizeSeverity, resolveSizeClass } from './shared/types'
export type { WiAppendTo, WiOverlayMountProps } from './shared/overlay'
export { isOverlayTeleported, resolveOverlayTeleport } from './shared/overlay'
export { useModalOverlay } from './shared/useModalOverlay'
export type { UseModalOverlayOptions } from './shared/useModalOverlay'

export {
  applyDensity,
  applyMotion,
  applyTheme,
  darkTokens,
  getPreferredMotion,
  getPreferredTheme,
  lightTokens,
  themeNames,
  useDensity,
  useMotion,
  useTheme,
} from './theme'
export type {
  ColorTokens,
  DensityPreference,
  DesignTokens,
  MotionPreference,
  MotionTokens,
  RadiusTokens,
  SpacingTokens,
  ThemeName,
} from './theme'
