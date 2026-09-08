// Evaluate the registry before the individual component re-exports.
import "./component-registry";

export { wkComponentNames, wkComponents } from "./component-registry";
export { default as WkAccordion } from "./components/Accordion/Accordion.vue";
export type {
  AccordionEmits,
  AccordionProps,
  AccordionTab,
} from "./components/Accordion/types";
export { default as WkAutoComplete } from "./components/AutoComplete/AutoComplete.vue";
export type {
  AutoCompleteEmits,
  AutoCompleteOption,
  AutoCompleteProps,
  AutoCompleteSuggestion,
} from "./components/AutoComplete/types";
export { default as WkAvatar } from "./components/Avatar/Avatar.vue";
export { default as WkAvatarGroup } from "./components/Avatar/AvatarGroup.vue";
export type {
  AvatarEmits,
  AvatarGroupProps,
  AvatarProps,
  AvatarShape,
  AvatarSize,
} from "./components/Avatar/types";
export { default as WkBadge } from "./components/Badge/Badge.vue";
export type {
  BadgeOffset,
  BadgeProps,
  BadgeSeverity,
  BadgeSize,
} from "./components/Badge/types";
export { default as WkBlockUI } from "./components/BlockUI/BlockUI.vue";
export type { BlockUIProps } from "./components/BlockUI/types";
export { default as WkBreadcrumb } from "./components/Breadcrumb/Breadcrumb.vue";
export type {
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbProps,
} from "./components/Breadcrumb/types";
export { default as WkButton } from "./components/Button/Button.vue";
export { default as WkButtonGroup } from "./components/Button/ButtonGroup.vue";
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
} from "./components/Button/types";
export { default as WkCard } from "./components/Card/Card.vue";
export type { CardProps, CardSize } from "./components/Card/types";
export { default as WkCarousel } from "./components/Carousel/Carousel.vue";
export type { CarouselEmits, CarouselProps } from "./components/Carousel/types";
export { default as WkCascadeSelect } from "./components/CascadeSelect/CascadeSelect.vue";
export type {
  CascadeSelectEmits,
  CascadeSelectOption,
  CascadeSelectProps,
  CascadeSelectValue,
} from "./components/CascadeSelect/types";
export { default as WkCheckbox } from "./components/Checkbox/Checkbox.vue";
export { default as WkCheckboxGroup } from "./components/Checkbox/CheckboxGroup.vue";
export type {
  CheckboxEmits,
  CheckboxGroupEmits,
  CheckboxGroupProps,
  CheckboxProps,
  CheckboxSize,
  CheckboxValue,
} from "./components/Checkbox/types";
export { default as WkChip } from "./components/Chip/Chip.vue";
export type {
  ChipEmits,
  ChipProps,
  ChipSeverity,
  ChipSize,
} from "./components/Chip/types";
export { default as WkCommandMenu } from "./components/CommandMenu/CommandMenu.vue";
export type {
  CommandMenuEmits,
  CommandMenuItem,
  CommandMenuProps,
} from "./components/CommandMenu/types";
export { default as WkConfigProvider } from "./components/ConfigProvider/ConfigProvider.vue";
export type {
  WkComponentDefaults,
  WkDensity,
  WkGlobalConfig,
  WkLocaleConfig,
} from "./components/ConfigProvider/types";
export { default as WkConfirmDialog } from "./components/ConfirmDialog/ConfirmDialog.vue";
export type {
  ConfirmDialogEmits,
  ConfirmDialogProps,
} from "./components/ConfirmDialog/types";
export { useConfirm } from "./components/ConfirmDialog/useConfirm";
export type { ConfirmRequireOptions } from "./components/ConfirmDialog/useConfirm";
export { default as WkConfirmPopup } from "./components/ConfirmPopup/ConfirmPopup.vue";
export type {
  ConfirmPopupEmits,
  ConfirmPopupPlacement,
  ConfirmPopupProps,
} from "./components/ConfirmPopup/types";
export { default as WkContextMenu } from "./components/ContextMenu/ContextMenu.vue";
export type {
  ContextMenuEmits,
  ContextMenuInstance,
  ContextMenuItem,
  ContextMenuPosition,
  ContextMenuProps,
} from "./components/ContextMenu/types";
export { useContextMenu } from "./components/ContextMenu/useContextMenu";
export { default as WkDataView } from "./components/DataView/DataView.vue";
export type {
  DataViewLayout,
  DataViewProps,
} from "./components/DataView/types";
export { default as WkDatePicker } from "./components/DatePicker/DatePicker.vue";
export type {
  DatePickerDateValue,
  DatePickerEmits,
  DatePickerModel,
  DatePickerProps,
  DatePickerShortcut,
  DatePickerType,
  DatePickerValue,
} from "./components/DatePicker/types";
export { default as WkDialog } from "./components/Dialog/Dialog.vue";
export type {
  DialogClickGuard,
  DialogCloseGuard,
  DialogEmits,
  DialogPosition,
  DialogProps,
  DialogType,
} from "./components/Dialog/types";
export { default as WkDivider } from "./components/Divider/Divider.vue";
export type {
  DividerAlign,
  DividerLayout,
  DividerProps,
  DividerType,
} from "./components/Divider/types";
export { default as WkDock } from "./components/Dock/Dock.vue";
export type { DockItem, DockProps } from "./components/Dock/types";
export { default as WkDrawer } from "./components/Drawer/Drawer.vue";
export type {
  DrawerEmits,
  DrawerPosition,
  DrawerProps,
} from "./components/Drawer/types";
export { default as WkDropdown } from "./components/Dropdown/Dropdown.vue";
export type {
  DropdownEmits,
  DropdownItem,
  DropdownItemType,
  DropdownProps,
  DropdownTrigger,
} from "./components/Dropdown/types";
export { default as WkFieldset } from "./components/Fieldset/Fieldset.vue";
export type { FieldsetEmits, FieldsetProps } from "./components/Fieldset/types";
export { default as WkFileUpload } from "./components/FileUpload/FileUpload.vue";
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
} from "./components/FileUpload/types";
export { default as WkFlex } from "./components/Flex/Flex.vue";
export type {
  FlexAlign,
  FlexJustify,
  FlexProps,
  FlexSize,
} from "./components/Flex/types";
export { default as WkFloatLabel } from "./components/FloatLabel/FloatLabel.vue";
export type { FloatLabelProps } from "./components/FloatLabel/types";
export { default as WkFluid } from "./components/Fluid/Fluid.vue";
export type { FluidProps } from "./components/Fluid/types";
export { WK_FORM_ERRORS_KEY, WK_FORM_KEY } from "./components/Form/context";
export type {
  FormFieldValidator,
  WkFormContext,
  WkFormFieldRegistration,
} from "./components/Form/context";
export { default as WkForm } from "./components/Form/Form.vue";
export { default as WkFormItem } from "./components/Form/FormItem.vue";
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
} from "./components/Form/types";
export { default as WkGallery } from "./components/Gallery/Gallery.vue";
export type { GalleryEmits, GalleryProps } from "./components/Gallery/types";
export { default as WkGrid } from "./components/Grid/Grid.vue";
export { default as WkGridItem } from "./components/Grid/GridItem.vue";
export { default as WkGi } from "./components/Grid/GridItem.vue";
export type {
  GridItemProps,
  GridProps,
  GridResponsive,
} from "./components/Grid/types";
export { WK_GRID_KEY } from "./components/Grid/types";
export { default as WkIcon } from "./components/Icon/Icon.vue";
export {
  getIconDefinition,
  iconNames,
  iconRegistry,
  isIconName,
} from "./components/Icon/icons";
export type {
  IconDefinition,
  IconName,
  IconPrimitive,
} from "./components/Icon/icons";
export type { IconProps, IconSize } from "./components/Icon/types";
export { default as WkIconField } from "./components/IconField/IconField.vue";
export type { IconFieldProps } from "./components/IconField/types";
export { default as WkInplace } from "./components/Inplace/Inplace.vue";
export type { InplaceEmits, InplaceProps } from "./components/Inplace/types";
export { default as WkInput } from "./components/Input/Input.vue";
export type { InputEmits, InputProps } from "./components/Input/types";
export { default as WkInputColor } from "./components/InputColor/InputColor.vue";
export type {
  InputColorEmits,
  InputColorProps,
} from "./components/InputColor/types";
export { default as WkInputGroup } from "./components/InputGroup/InputGroup.vue";
export { default as WkInputGroupAddon } from "./components/InputGroup/InputGroupAddon.vue";
export type {
  InputGroupAddonProps,
  InputGroupProps,
} from "./components/InputGroup/types";
export { default as WkInputNumber } from "./components/InputNumber/InputNumber.vue";
export type {
  InputNumberButtonPlacement,
  InputNumberEmits,
  InputNumberProps,
} from "./components/InputNumber/types";
export { default as WkInputOtp } from "./components/InputOtp/InputOtp.vue";
export type { InputOtpEmits, InputOtpProps } from "./components/InputOtp/types";
export { default as WkInputPassword } from "./components/InputPassword/InputPassword.vue";
export type {
  InputPasswordEmits,
  InputPasswordProps,
  InputPasswordSlots,
  PasswordStrength,
  WkShowPasswordOn,
} from "./components/InputPassword/types";
export { default as WkInputTags } from "./components/InputTags/InputTags.vue";
export type {
  InputTagsEmits,
  InputTagsProps,
} from "./components/InputTags/types";
export { default as WkKnob } from "./components/Knob/Knob.vue";
export type { KnobEmits, KnobProps } from "./components/Knob/types";
export { default as WkLabel } from "./components/Label/Label.vue";
export type { LabelProps } from "./components/Label/types";
export { WK_LAYOUT_KEY } from "./components/Layout/context";
export { default as WkLayout } from "./components/Layout/Layout.vue";
export { default as WkLayoutContent } from "./components/Layout/LayoutContent.vue";
export { default as WkLayoutFooter } from "./components/Layout/LayoutFooter.vue";
export { default as WkLayoutHeader } from "./components/Layout/LayoutHeader.vue";
export { default as WkLayoutSider } from "./components/Layout/LayoutSider.vue";
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
} from "./components/Layout/types";
export { default as WkListbox } from "./components/Listbox/Listbox.vue";
export type {
  ListboxEmits,
  ListboxOption,
  ListboxProps,
  ListboxValue,
} from "./components/Listbox/types";
export { default as WkMegaMenu } from "./components/MegaMenu/MegaMenu.vue";
export type { MegaMenuItem, MegaMenuProps } from "./components/MegaMenu/types";
export { default as WkMenu } from "./components/Menu/Menu.vue";
export type { MenuEmits, MenuItem, MenuProps } from "./components/Menu/types";
export { default as WkMenubar } from "./components/Menubar/Menubar.vue";
export type {
  MenubarEmits,
  MenubarItem,
  MenubarProps,
} from "./components/Menubar/types";
export { message, useMessage } from "./components/Message/message";
export { default as WkMessage } from "./components/Message/Message.vue";
export type {
  MessageHandle,
  MessageHostConfig,
  MessageInput,
  MessageItem,
  MessageOptions,
  MessagePlacement,
  MessageProps,
  MessageSeverity,
} from "./components/Message/types";
export { default as WkMeterGroup } from "./components/MeterGroup/MeterGroup.vue";
export type {
  MeterGroupItem,
  MeterGroupProps,
} from "./components/MeterGroup/types";
export { default as WkOrderList } from "./components/OrderList/OrderList.vue";
export type {
  OrderListEmits,
  OrderListProps,
} from "./components/OrderList/types";
export { default as WkPagination } from "./components/Pagination/Pagination.vue";
export type {
  PaginationEmits,
  PaginationInstance,
  PaginationProps,
} from "./components/Pagination/types";
export { default as WkPanel } from "./components/Panel/Panel.vue";
export type {
  PanelEmits,
  PanelProps,
  PanelSize,
} from "./components/Panel/types";
export { default as WkPickList } from "./components/PickList/PickList.vue";
export type { PickListEmits, PickListProps } from "./components/PickList/types";
export { default as WkPopover } from "./components/Popover/Popover.vue";
export type {
  PopoverEmits,
  PopoverPlacement,
  PopoverProps,
  PopoverTrigger,
} from "./components/Popover/types";
export { default as WkProgressBar } from "./components/ProgressBar/ProgressBar.vue";
export type {
  ProgressBarMode,
  ProgressBarProps,
  ProgressBarStatus,
  ProgressBarType,
} from "./components/ProgressBar/types";
export { default as WkProgressSpinner } from "./components/ProgressSpinner/ProgressSpinner.vue";
export type { ProgressSpinnerProps } from "./components/ProgressSpinner/types";
export { default as WkRadio } from "./components/Radio/Radio.vue";
export { default as WkRadioGroup } from "./components/Radio/RadioGroup.vue";
export type {
  RadioEmits,
  RadioGroupEmits,
  RadioGroupProps,
  RadioProps,
  RadioSize,
  RadioValue,
} from "./components/Radio/types";
export { default as WkRating } from "./components/Rating/Rating.vue";
export type { RatingEmits, RatingProps } from "./components/Rating/types";
export { default as WkScrollbar } from "./components/Scrollbar/Scrollbar.vue";
export type {
  ScrollbarAriaOrientation,
  ScrollbarDirection,
  ScrollbarEmits,
  ScrollbarInstance,
  ScrollbarProps,
  ScrollbarScrollPayload,
} from "./components/Scrollbar/types";
export { default as WkScrollTop } from "./components/ScrollTop/ScrollTop.vue";
export type {
  ScrollTopProps,
  ScrollTopTarget,
} from "./components/ScrollTop/types";
export { default as WkSelect } from "./components/Select/Select.vue";
export type {
  SelectEmits,
  SelectModelValue,
  SelectOption,
  SelectProps,
  SelectSize,
  SelectValue,
} from "./components/Select/types";
export { default as WkSelectButton } from "./components/SelectButton/SelectButton.vue";
export type {
  SelectButtonEmits,
  SelectButtonOption,
  SelectButtonProps,
  SelectButtonValue,
} from "./components/SelectButton/types";
export { default as WkSidebar } from "./components/Sidebar/Sidebar.vue";
export type { SidebarItem, SidebarProps } from "./components/Sidebar/types";
export { default as WkSkeleton } from "./components/Skeleton/Skeleton.vue";
export type {
  SkeletonAnimation,
  SkeletonProps,
  SkeletonShape,
} from "./components/Skeleton/types";
export { default as WkSlider } from "./components/Slider/Slider.vue";
export type {
  SliderEmits,
  SliderMarks,
  SliderProps,
} from "./components/Slider/types";
export { default as WkSpace } from "./components/Space/Space.vue";
export type {
  SpaceAlign,
  SpaceJustify,
  SpaceProps,
  SpaceSize,
} from "./components/Space/types";
export { default as WkSpeedDial } from "./components/SpeedDial/SpeedDial.vue";
export type {
  SpeedDialDirection,
  SpeedDialEmits,
  SpeedDialItem,
  SpeedDialProps,
} from "./components/SpeedDial/types";
export { default as WkSplitButton } from "./components/SplitButton/SplitButton.vue";
export type {
  SplitButtonEmits,
  SplitButtonItem,
  SplitButtonProps,
} from "./components/SplitButton/types";
export { default as WkSplitter } from "./components/Splitter/Splitter.vue";
export type {
  SplitterEmits,
  SplitterLayout,
  SplitterProps,
  SplitterSize,
} from "./components/Splitter/types";
export { default as WkStepper } from "./components/Stepper/Stepper.vue";
export type {
  StepperEmits,
  StepperOrientation,
  StepperProps,
  StepperStatus,
  StepperStep,
} from "./components/Stepper/types";
export { default as WkSwitch } from "./components/Switch/Switch.vue";
export type {
  SwitchEmits,
  SwitchProps,
  SwitchSize,
} from "./components/Switch/types";
export { default as WkTable } from "./components/Table/Table.vue";
export type {
  TableBodyItemClassName,
  TableBodyRowClassName,
  TableClickEventType,
  TableColumn,
  TableColumnAlign,
  TableColumnDefinition,
  TableColumnFilter,
  TableEmits,
  TableFilterComparison,
  TableFilterOption,
  TableHeaderItemClassName,
  TableItem,
  TableProps,
  TableServerOptions,
  TableSize,
  TableSortMode,
  TableSortPayload,
  TableSortType,
  TableTextDirection,
} from "./components/Table/types";
export { default as WkTabs } from "./components/Tabs/Tabs.vue";
export type {
  TabItem,
  TabsEmits,
  TabsProps,
  TabsType,
} from "./components/Tabs/types";
export { default as WkTag } from "./components/Tag/Tag.vue";
export type {
  TagEmits,
  TagProps,
  TagSeverity,
  TagSize,
} from "./components/Tag/types";
export { default as WkTerminal } from "./components/Terminal/Terminal.vue";
export type { TerminalEmits, TerminalProps } from "./components/Terminal/types";
export { default as WkTextarea } from "./components/Textarea/Textarea.vue";
export type {
  WkTextareaAutosize,
  TextareaEmits,
  TextareaInstance,
  TextareaProps,
} from "./components/Textarea/types";
export { default as WkTieredMenu } from "./components/TieredMenu/TieredMenu.vue";
export type {
  TieredMenuEmits,
  TieredMenuItem,
  TieredMenuProps,
} from "./components/TieredMenu/types";
export { default as WkTimeline } from "./components/Timeline/Timeline.vue";
export type {
  TimelineAlign,
  TimelineEvent,
  TimelineLayout,
  TimelineProps,
  TimelineSeverity,
} from "./components/Timeline/types";
export { toast, useToast } from "./components/Toast/toast";
export { default as WkToast } from "./components/Toast/Toast.vue";
export type {
  ToastEmits,
  ToastHandle,
  ToastInput,
  ToastMessage,
  ToastOptions,
  ToastPosition,
  ToastProps,
  ToastSeverity,
} from "./components/Toast/types";
export { default as WkToggleButton } from "./components/ToggleButton/ToggleButton.vue";
export type {
  ToggleButtonEmits,
  ToggleButtonProps,
} from "./components/ToggleButton/types";
export { default as WkToolbar } from "./components/Toolbar/Toolbar.vue";
export type { ToolbarProps } from "./components/Toolbar/types";
export { default as WkTooltip } from "./components/Tooltip/Tooltip.vue";
export type { TooltipProps } from "./components/Tooltip/types";

export { default as WkTree } from "./components/Tree/Tree.vue";
export type {
  TreeCheckedKeys,
  TreeCheckStrategy,
  TreeEmits,
  TreeExpandedKeys,
  TreeNode,
  TreeProps,
  TreeSelectionKeys,
  TreeSelectionMode,
} from "./components/Tree/types";
export { default as WkTreeSelect } from "./components/TreeSelect/TreeSelect.vue";
export type {
  TreeSelectEmits,
  TreeSelectNode,
  TreeSelectProps,
  TreeSelectValue,
} from "./components/TreeSelect/types";
export { default as WkTreeTable } from "./components/TreeTable/TreeTable.vue";

export type {
  TreeTableColumn,
  TreeTableEmits,
  TreeTableNode,
  TreeTableProps,
} from "./components/TreeTable/types";
export type {
  VirtualScrollerItemSlotProps,
  VirtualScrollerProps,
} from "./components/VirtualScroller/types";
export { default as WkVirtualScroller } from "./components/VirtualScroller/VirtualScroller.vue";
export { enUS, formatLocale, mergeLocale, useWkLocale, zhCN } from "./locale";
export type { WkLocaleMessages, WkLocaleName } from "./locale";
export type { WkComponentDefaultMap } from "./shared/componentDefaults";
export {
  createWiseKit,
  getComponentDefault,
  getComponentDefaults,
  getDefaultWkConfig,
  installWiseKit,
  mergeComponentDefaults,
  mergeWkConfig,
  provideWkConfig,
  WK_CONFIG_KEY,
  resolveConfiguredAppendTo,
  WiseKit,
  useComponentDefaults,
  useConfiguredGapSize,
  useConfiguredSize,
  useConfiguredVariant,
  useWkConfig,
} from "./shared/config";
export type { WkInstallerOptions } from "./shared/config";
export { WiseKit as default } from "./shared/config";
export type { WkRenderable } from "./shared/content";
export { renderWkContent } from "./shared/content";
export type { WkAppendTo, WkOverlayMountProps } from "./shared/overlay";
export { isOverlayTeleported, resolveOverlayTeleport } from "./shared/overlay";
export type {
  WkInputVariant,
  WkSeverity,
  WkSize,
  WkSizeInput,
  WkTagSeverity,
  WkToastSeverity,
} from "./shared/types";
export { normalizeSeverity, resolveSizeClass } from "./shared/types";
export { useModalOverlay } from "./shared/useModalOverlay";

export type { UseModalOverlayOptions } from "./shared/useModalOverlay";
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
} from "./theme";

export type {
  ColorTokens,
  DensityPreference,
  DesignTokens,
  LayoutTokens,
  MotionPreference,
  MotionTokens,
  RadiusTokens,
  SpacingTokens,
  ThemeName,
} from "./theme";
