// Evaluate the registry before the individual component re-exports.
import "./component-registry";

export * from "./compat/wd-exports";
export { rdComponentNames, rdComponents } from "./component-registry";
/** @deprecated Use `rdComponentNames` */
export { rdComponentNames as wdComponentNames } from "./component-registry";
export { default as RdAccordion } from "./components/Accordion/Accordion.vue";
export type {
  AccordionEmits,
  AccordionProps,
  AccordionTab,
} from "./components/Accordion/types";
export { default as RdAutoComplete } from "./components/AutoComplete/AutoComplete.vue";
export type {
  AutoCompleteEmits,
  AutoCompleteOption,
  AutoCompleteProps,
  AutoCompleteSuggestion,
} from "./components/AutoComplete/types";
export { default as RdAvatar } from "./components/Avatar/Avatar.vue";
export { default as RdAvatarGroup } from "./components/Avatar/AvatarGroup.vue";
export type {
  AvatarEmits,
  AvatarGroupProps,
  AvatarProps,
  AvatarShape,
  AvatarSize,
} from "./components/Avatar/types";
export { default as RdBadge } from "./components/Badge/Badge.vue";
export type {
  BadgeOffset,
  BadgeProps,
  BadgeSeverity,
  BadgeSize,
} from "./components/Badge/types";
export { default as RdBlockUI } from "./components/BlockUI/BlockUI.vue";
export type { BlockUIProps } from "./components/BlockUI/types";
export { default as RdBreadcrumb } from "./components/Breadcrumb/Breadcrumb.vue";
export type {
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbProps,
} from "./components/Breadcrumb/types";
export { default as RdButton } from "./components/Button/Button.vue";
export { default as RdButtonGroup } from "./components/Button/ButtonGroup.vue";
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
export { default as RdCard } from "./components/Card/Card.vue";
export type { CardProps, CardSize } from "./components/Card/types";
export { default as RdCarousel } from "./components/Carousel/Carousel.vue";
export type { CarouselEmits, CarouselProps } from "./components/Carousel/types";
export { default as RdCascadeSelect } from "./components/CascadeSelect/CascadeSelect.vue";
export type {
  CascadeSelectEmits,
  CascadeSelectOption,
  CascadeSelectProps,
  CascadeSelectValue,
} from "./components/CascadeSelect/types";
export { default as RdCheckbox } from "./components/Checkbox/Checkbox.vue";
export { default as RdCheckboxGroup } from "./components/Checkbox/CheckboxGroup.vue";
export type {
  CheckboxEmits,
  CheckboxGroupEmits,
  CheckboxGroupProps,
  CheckboxProps,
  CheckboxSize,
  CheckboxValue,
} from "./components/Checkbox/types";
export { default as RdChip } from "./components/Chip/Chip.vue";
export type {
  ChipEmits,
  ChipProps,
  ChipSeverity,
  ChipSize,
} from "./components/Chip/types";
export { default as RdCommandMenu } from "./components/CommandMenu/CommandMenu.vue";
export type {
  CommandMenuEmits,
  CommandMenuItem,
  CommandMenuProps,
} from "./components/CommandMenu/types";
export { default as RdConfigProvider } from "./components/ConfigProvider/ConfigProvider.vue";
export type {
  RdComponentDefaults,
  RdDensity,
  RdGlobalConfig,
  RdLocaleConfig,
} from "./components/ConfigProvider/types";
export { default as RdConfirmDialog } from "./components/ConfirmDialog/ConfirmDialog.vue";
export type {
  ConfirmDialogEmits,
  ConfirmDialogProps,
} from "./components/ConfirmDialog/types";
export { useConfirm } from "./components/ConfirmDialog/useConfirm";
export type { ConfirmRequireOptions } from "./components/ConfirmDialog/useConfirm";
export { default as RdConfirmPopup } from "./components/ConfirmPopup/ConfirmPopup.vue";
export type {
  ConfirmPopupEmits,
  ConfirmPopupPlacement,
  ConfirmPopupProps,
} from "./components/ConfirmPopup/types";
export { default as RdContextMenu } from "./components/ContextMenu/ContextMenu.vue";
export type {
  ContextMenuEmits,
  ContextMenuInstance,
  ContextMenuItem,
  ContextMenuPosition,
  ContextMenuProps,
} from "./components/ContextMenu/types";
export { useContextMenu } from "./components/ContextMenu/useContextMenu";
export { default as RdDataView } from "./components/DataView/DataView.vue";
export type {
  DataViewLayout,
  DataViewProps,
} from "./components/DataView/types";
export { default as RdDatePicker } from "./components/DatePicker/DatePicker.vue";
export type {
  DatePickerDateValue,
  DatePickerEmits,
  DatePickerModel,
  DatePickerProps,
  DatePickerShortcut,
  DatePickerType,
  DatePickerValue,
} from "./components/DatePicker/types";
export { default as RdDialog } from "./components/Dialog/Dialog.vue";
export type {
  DialogClickGuard,
  DialogCloseGuard,
  DialogEmits,
  DialogPosition,
  DialogProps,
  DialogType,
} from "./components/Dialog/types";
export { default as RdDivider } from "./components/Divider/Divider.vue";
export type {
  DividerAlign,
  DividerLayout,
  DividerProps,
  DividerType,
} from "./components/Divider/types";
export { default as RdDock } from "./components/Dock/Dock.vue";
export type { DockItem, DockProps } from "./components/Dock/types";
export { default as RdDrawer } from "./components/Drawer/Drawer.vue";
export type {
  DrawerEmits,
  DrawerPosition,
  DrawerProps,
} from "./components/Drawer/types";
export { default as RdDropdown } from "./components/Dropdown/Dropdown.vue";
export type {
  DropdownEmits,
  DropdownItem,
  DropdownItemType,
  DropdownProps,
  DropdownTrigger,
} from "./components/Dropdown/types";
export { default as RdFieldset } from "./components/Fieldset/Fieldset.vue";
export type { FieldsetEmits, FieldsetProps } from "./components/Fieldset/types";
export { default as RdFileUpload } from "./components/FileUpload/FileUpload.vue";
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
export { default as RdFlex } from "./components/Flex/Flex.vue";
export type {
  FlexAlign,
  FlexJustify,
  FlexProps,
  FlexSize,
} from "./components/Flex/types";
export { default as RdFloatLabel } from "./components/FloatLabel/FloatLabel.vue";
export type { FloatLabelProps } from "./components/FloatLabel/types";
export { default as RdFluid } from "./components/Fluid/Fluid.vue";
export type { FluidProps } from "./components/Fluid/types";
export { RD_FORM_ERRORS_KEY, RD_FORM_KEY } from "./components/Form/context";
export type {
  FormFieldValidator,
  RdFormContext,
  RdFormFieldRegistration,
} from "./components/Form/context";
export { default as RdForm } from "./components/Form/Form.vue";
export { default as RdFormItem } from "./components/Form/FormItem.vue";
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
export { default as RdGallery } from "./components/Gallery/Gallery.vue";
export type { GalleryEmits, GalleryProps } from "./components/Gallery/types";
export { default as RdGrid } from "./components/Grid/Grid.vue";
export { default as RdGridItem } from "./components/Grid/GridItem.vue";
export { default as RdGi } from "./components/Grid/GridItem.vue";
export type {
  GridItemProps,
  GridProps,
  GridResponsive,
} from "./components/Grid/types";
export { RD_GRID_KEY } from "./components/Grid/types";
export { default as RdIcon } from "./components/Icon/Icon.vue";
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
export { default as RdIconField } from "./components/IconField/IconField.vue";
export type { IconFieldProps } from "./components/IconField/types";
export { default as RdInplace } from "./components/Inplace/Inplace.vue";
export type { InplaceEmits, InplaceProps } from "./components/Inplace/types";
export { default as RdInput } from "./components/Input/Input.vue";
export type { InputEmits, InputProps } from "./components/Input/types";
export { default as RdInputColor } from "./components/InputColor/InputColor.vue";
export type {
  InputColorEmits,
  InputColorProps,
} from "./components/InputColor/types";
export { default as RdInputGroup } from "./components/InputGroup/InputGroup.vue";
export { default as RdInputGroupAddon } from "./components/InputGroup/InputGroupAddon.vue";
export type {
  InputGroupAddonProps,
  InputGroupProps,
} from "./components/InputGroup/types";
export { default as RdInputNumber } from "./components/InputNumber/InputNumber.vue";
export type {
  InputNumberButtonPlacement,
  InputNumberEmits,
  InputNumberProps,
} from "./components/InputNumber/types";
export { default as RdInputOtp } from "./components/InputOtp/InputOtp.vue";
export type { InputOtpEmits, InputOtpProps } from "./components/InputOtp/types";
export { default as RdInputPassword } from "./components/InputPassword/InputPassword.vue";
export type {
  InputPasswordEmits,
  InputPasswordProps,
  InputPasswordSlots,
  PasswordStrength,
  RdShowPasswordOn,
} from "./components/InputPassword/types";
export { default as RdInputTags } from "./components/InputTags/InputTags.vue";
export type {
  InputTagsEmits,
  InputTagsProps,
} from "./components/InputTags/types";
export { default as RdKnob } from "./components/Knob/Knob.vue";
export type { KnobEmits, KnobProps } from "./components/Knob/types";
export { default as RdLabel } from "./components/Label/Label.vue";
export type { LabelProps } from "./components/Label/types";
export { RD_LAYOUT_KEY } from "./components/Layout/context";
export { default as RdLayout } from "./components/Layout/Layout.vue";
export { default as RdLayoutContent } from "./components/Layout/LayoutContent.vue";
export { default as RdLayoutFooter } from "./components/Layout/LayoutFooter.vue";
export { default as RdLayoutHeader } from "./components/Layout/LayoutHeader.vue";
export { default as RdLayoutSider } from "./components/Layout/LayoutSider.vue";
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
export { default as RdListbox } from "./components/Listbox/Listbox.vue";
export type {
  ListboxEmits,
  ListboxOption,
  ListboxProps,
  ListboxValue,
} from "./components/Listbox/types";
export { default as RdMegaMenu } from "./components/MegaMenu/MegaMenu.vue";
export type { MegaMenuItem, MegaMenuProps } from "./components/MegaMenu/types";
export { default as RdMenu } from "./components/Menu/Menu.vue";
export type { MenuEmits, MenuItem, MenuProps } from "./components/Menu/types";
export { default as RdMenubar } from "./components/Menubar/Menubar.vue";
export type {
  MenubarEmits,
  MenubarItem,
  MenubarProps,
} from "./components/Menubar/types";
export { message, useMessage } from "./components/Message/message";
export { default as RdMessage } from "./components/Message/Message.vue";
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
export { default as RdMeterGroup } from "./components/MeterGroup/MeterGroup.vue";
export type {
  MeterGroupItem,
  MeterGroupProps,
} from "./components/MeterGroup/types";
export { default as RdOrderList } from "./components/OrderList/OrderList.vue";
export type {
  OrderListEmits,
  OrderListProps,
} from "./components/OrderList/types";
export { default as RdPagination } from "./components/Pagination/Pagination.vue";
export type {
  PaginationEmits,
  PaginationInstance,
  PaginationProps,
} from "./components/Pagination/types";
export { default as RdPanel } from "./components/Panel/Panel.vue";
export type {
  PanelEmits,
  PanelProps,
  PanelSize,
} from "./components/Panel/types";
export { default as RdPickList } from "./components/PickList/PickList.vue";
export type { PickListEmits, PickListProps } from "./components/PickList/types";
export { default as RdPopover } from "./components/Popover/Popover.vue";
export type {
  PopoverEmits,
  PopoverPlacement,
  PopoverProps,
  PopoverTrigger,
} from "./components/Popover/types";
export { default as RdProgressBar } from "./components/ProgressBar/ProgressBar.vue";
export type {
  ProgressBarMode,
  ProgressBarProps,
  ProgressBarStatus,
  ProgressBarType,
} from "./components/ProgressBar/types";
export { default as RdProgressSpinner } from "./components/ProgressSpinner/ProgressSpinner.vue";
export type { ProgressSpinnerProps } from "./components/ProgressSpinner/types";
export { default as RdRadio } from "./components/Radio/Radio.vue";
export { default as RdRadioGroup } from "./components/Radio/RadioGroup.vue";
export type {
  RadioEmits,
  RadioGroupEmits,
  RadioGroupProps,
  RadioProps,
  RadioSize,
  RadioValue,
} from "./components/Radio/types";
export { default as RdRating } from "./components/Rating/Rating.vue";
export type { RatingEmits, RatingProps } from "./components/Rating/types";
export { default as RdScrollbar } from "./components/Scrollbar/Scrollbar.vue";
export type {
  ScrollbarAriaOrientation,
  ScrollbarDirection,
  ScrollbarEmits,
  ScrollbarInstance,
  ScrollbarProps,
  ScrollbarScrollPayload,
} from "./components/Scrollbar/types";
export { default as RdScrollTop } from "./components/ScrollTop/ScrollTop.vue";
export type {
  ScrollTopProps,
  ScrollTopTarget,
} from "./components/ScrollTop/types";
export { default as RdSelect } from "./components/Select/Select.vue";
export type {
  SelectEmits,
  SelectModelValue,
  SelectOption,
  SelectProps,
  SelectSize,
  SelectValue,
} from "./components/Select/types";
export { default as RdSelectButton } from "./components/SelectButton/SelectButton.vue";
export type {
  SelectButtonEmits,
  SelectButtonOption,
  SelectButtonProps,
  SelectButtonValue,
} from "./components/SelectButton/types";
export { default as RdSidebar } from "./components/Sidebar/Sidebar.vue";
export type { SidebarItem, SidebarProps } from "./components/Sidebar/types";
export { default as RdSkeleton } from "./components/Skeleton/Skeleton.vue";
export type {
  SkeletonAnimation,
  SkeletonProps,
  SkeletonShape,
} from "./components/Skeleton/types";
export { default as RdSlider } from "./components/Slider/Slider.vue";
export type {
  SliderEmits,
  SliderMarks,
  SliderProps,
} from "./components/Slider/types";
export { default as RdSpace } from "./components/Space/Space.vue";
export type {
  SpaceAlign,
  SpaceJustify,
  SpaceProps,
  SpaceSize,
} from "./components/Space/types";
export { default as RdSpeedDial } from "./components/SpeedDial/SpeedDial.vue";
export type {
  SpeedDialDirection,
  SpeedDialEmits,
  SpeedDialItem,
  SpeedDialProps,
} from "./components/SpeedDial/types";
export { default as RdSplitButton } from "./components/SplitButton/SplitButton.vue";
export type {
  SplitButtonEmits,
  SplitButtonItem,
  SplitButtonProps,
} from "./components/SplitButton/types";
export { default as RdSplitter } from "./components/Splitter/Splitter.vue";
export type {
  SplitterEmits,
  SplitterLayout,
  SplitterProps,
  SplitterSize,
} from "./components/Splitter/types";
export { default as RdStepper } from "./components/Stepper/Stepper.vue";
export type {
  StepperEmits,
  StepperOrientation,
  StepperProps,
  StepperStatus,
  StepperStep,
} from "./components/Stepper/types";
export { default as RdSwitch } from "./components/Switch/Switch.vue";
export type {
  SwitchEmits,
  SwitchProps,
  SwitchSize,
} from "./components/Switch/types";
export { default as RdTable } from "./components/Table/Table.vue";
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
export { default as RdTabs } from "./components/Tabs/Tabs.vue";
export type {
  TabItem,
  TabsEmits,
  TabsProps,
  TabsType,
} from "./components/Tabs/types";
export { default as RdTag } from "./components/Tag/Tag.vue";
export type {
  TagEmits,
  TagProps,
  TagSeverity,
  TagSize,
} from "./components/Tag/types";
export { default as RdTerminal } from "./components/Terminal/Terminal.vue";
export type { TerminalEmits, TerminalProps } from "./components/Terminal/types";
export { default as RdTextarea } from "./components/Textarea/Textarea.vue";
export type {
  RdTextareaAutosize,
  TextareaEmits,
  TextareaInstance,
  TextareaProps,
} from "./components/Textarea/types";
export { default as RdTieredMenu } from "./components/TieredMenu/TieredMenu.vue";
export type {
  TieredMenuEmits,
  TieredMenuItem,
  TieredMenuProps,
} from "./components/TieredMenu/types";
export { default as RdTimeline } from "./components/Timeline/Timeline.vue";
export type {
  TimelineAlign,
  TimelineEvent,
  TimelineLayout,
  TimelineProps,
  TimelineSeverity,
} from "./components/Timeline/types";
export { toast, useToast } from "./components/Toast/toast";
export { default as RdToast } from "./components/Toast/Toast.vue";
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
export { default as RdToggleButton } from "./components/ToggleButton/ToggleButton.vue";
export type {
  ToggleButtonEmits,
  ToggleButtonProps,
} from "./components/ToggleButton/types";
export { default as RdToolbar } from "./components/Toolbar/Toolbar.vue";
export type { ToolbarProps } from "./components/Toolbar/types";
export { default as RdTooltip } from "./components/Tooltip/Tooltip.vue";
export type { TooltipProps } from "./components/Tooltip/types";

export { default as RdTree } from "./components/Tree/Tree.vue";
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
export { default as RdTreeSelect } from "./components/TreeSelect/TreeSelect.vue";
export type {
  TreeSelectEmits,
  TreeSelectNode,
  TreeSelectProps,
  TreeSelectValue,
} from "./components/TreeSelect/types";
export { default as RdTreeTable } from "./components/TreeTable/TreeTable.vue";

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
export { default as RdVirtualScroller } from "./components/VirtualScroller/VirtualScroller.vue";
export { enUS, formatLocale, mergeLocale, useRdLocale, useWdLocale, zhCN } from "./locale";
export type { RdLocaleMessages, RdLocaleName } from "./locale";
export type { RdComponentDefaultMap } from "./shared/componentDefaults";
export {
  createRoostDesign,
  createWexDesign,
  getComponentDefault,
  getComponentDefaults,
  getDefaultRdConfig,
  installRoostDesign,
  installWexDesign,
  mergeComponentDefaults,
  mergeRdConfig,
  provideRdConfig,
  RD_CONFIG_KEY,
  resolveConfiguredAppendTo,
  RoostDesign,
  useComponentDefaults,
  useConfiguredGapSize,
  useConfiguredSize,
  useConfiguredVariant,
  useRdConfig,
  useWdConfig,
  WexDesign,
} from "./shared/config";
export type { RdInstallerOptions } from "./shared/config";
export { RoostDesign as default } from "./shared/config";
export type { RdRenderable } from "./shared/content";
export type { RdAppendTo, RdOverlayMountProps } from "./shared/overlay";
export { isOverlayTeleported, resolveOverlayTeleport } from "./shared/overlay";
export type {
  RdInputVariant,
  RdSeverity,
  RdSize,
  RdSizeInput,
  RdTagSeverity,
  RdToastSeverity,
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
