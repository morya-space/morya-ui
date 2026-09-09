// Evaluate the registry before the individual component re-exports.
import "./component-registry";

export { mComponentNames, mComponents } from "./component-registry";
export { default as MAccordion } from "./components/Accordion/Accordion.vue";
export type {
  AccordionEmits,
  AccordionProps,
  AccordionTab,
} from "./components/Accordion/types";
export { default as MAutoComplete } from "./components/AutoComplete/AutoComplete.vue";
export type {
  AutoCompleteEmits,
  AutoCompleteOption,
  AutoCompleteProps,
  AutoCompleteSuggestion,
} from "./components/AutoComplete/types";
export { default as MAvatar } from "./components/Avatar/Avatar.vue";
export { default as MAvatarGroup } from "./components/Avatar/AvatarGroup.vue";
export type {
  AvatarEmits,
  AvatarGroupProps,
  AvatarProps,
  AvatarShape,
  AvatarSize,
} from "./components/Avatar/types";
export { default as MBadge } from "./components/Badge/Badge.vue";
export type {
  BadgeOffset,
  BadgeProps,
  BadgeSeverity,
  BadgeSize,
} from "./components/Badge/types";
export { default as MBlockUI } from "./components/BlockUI/BlockUI.vue";
export type { BlockUIProps } from "./components/BlockUI/types";
export { default as MBreadcrumb } from "./components/Breadcrumb/Breadcrumb.vue";
export type {
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbProps,
} from "./components/Breadcrumb/types";
export { default as MButton } from "./components/Button/Button.vue";
export { default as MButtonGroup } from "./components/Button/ButtonGroup.vue";
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
export { default as MCard } from "./components/Card/Card.vue";
export type { CardProps, CardSize } from "./components/Card/types";
export { default as MCarousel } from "./components/Carousel/Carousel.vue";
export type { CarouselEmits, CarouselProps } from "./components/Carousel/types";
export { default as MCascadeSelect } from "./components/CascadeSelect/CascadeSelect.vue";
export type {
  CascadeSelectEmits,
  CascadeSelectOption,
  CascadeSelectProps,
  CascadeSelectValue,
} from "./components/CascadeSelect/types";
export { default as MCheckbox } from "./components/Checkbox/Checkbox.vue";
export { default as MCheckboxGroup } from "./components/Checkbox/CheckboxGroup.vue";
export type {
  CheckboxEmits,
  CheckboxGroupEmits,
  CheckboxGroupProps,
  CheckboxProps,
  CheckboxSize,
  CheckboxValue,
} from "./components/Checkbox/types";
export { default as MChip } from "./components/Chip/Chip.vue";
export type {
  ChipEmits,
  ChipProps,
  ChipSeverity,
  ChipSize,
} from "./components/Chip/types";
export { default as MCommandMenu } from "./components/CommandMenu/CommandMenu.vue";
export type {
  CommandMenuEmits,
  CommandMenuItem,
  CommandMenuProps,
} from "./components/CommandMenu/types";
export { default as MConfigProvider } from "./components/ConfigProvider/ConfigProvider.vue";
export type {
  MComponentDefaults,
  MDensity,
  MGlobalConfig,
  MLocaleConfig,
} from "./components/ConfigProvider/types";
export { default as MConfirmDialog } from "./components/ConfirmDialog/ConfirmDialog.vue";
export type {
  ConfirmDialogEmits,
  ConfirmDialogProps,
} from "./components/ConfirmDialog/types";
export { useConfirm } from "./components/ConfirmDialog/useConfirm";
export type { ConfirmRequireOptions } from "./components/ConfirmDialog/useConfirm";
export { default as MConfirmPopup } from "./components/ConfirmPopup/ConfirmPopup.vue";
export type {
  ConfirmPopupEmits,
  ConfirmPopupPlacement,
  ConfirmPopupProps,
} from "./components/ConfirmPopup/types";
export { default as MContextMenu } from "./components/ContextMenu/ContextMenu.vue";
export type {
  ContextMenuEmits,
  ContextMenuInstance,
  ContextMenuItem,
  ContextMenuPosition,
  ContextMenuProps,
} from "./components/ContextMenu/types";
export { useContextMenu } from "./components/ContextMenu/useContextMenu";
export { default as MDataView } from "./components/DataView/DataView.vue";
export type {
  DataViewLayout,
  DataViewProps,
} from "./components/DataView/types";
export { default as MDatePicker } from "./components/DatePicker/DatePicker.vue";
export type {
  DatePickerDateValue,
  DatePickerEmits,
  DatePickerModel,
  DatePickerProps,
  DatePickerShortcut,
  DatePickerType,
  DatePickerValue,
} from "./components/DatePicker/types";
export { default as MDialog } from "./components/Dialog/Dialog.vue";
export type {
  DialogClickGuard,
  DialogCloseGuard,
  DialogEmits,
  DialogPosition,
  DialogProps,
  DialogType,
} from "./components/Dialog/types";
export { default as MDivider } from "./components/Divider/Divider.vue";
export type {
  DividerAlign,
  DividerLayout,
  DividerProps,
  DividerType,
} from "./components/Divider/types";
export { default as MDock } from "./components/Dock/Dock.vue";
export type { DockItem, DockProps } from "./components/Dock/types";
export { default as MDrawer } from "./components/Drawer/Drawer.vue";
export type {
  DrawerEmits,
  DrawerPosition,
  DrawerProps,
} from "./components/Drawer/types";
export { default as MDropdown } from "./components/Dropdown/Dropdown.vue";
export type {
  DropdownEmits,
  DropdownItem,
  DropdownItemType,
  DropdownProps,
  DropdownTrigger,
} from "./components/Dropdown/types";
export { default as MFieldset } from "./components/Fieldset/Fieldset.vue";
export type { FieldsetEmits, FieldsetProps } from "./components/Fieldset/types";
export { default as MFileUpload } from "./components/FileUpload/FileUpload.vue";
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
export { default as MFlex } from "./components/Flex/Flex.vue";
export type {
  FlexAlign,
  FlexJustify,
  FlexProps,
  FlexSize,
} from "./components/Flex/types";
export { default as MFloatLabel } from "./components/FloatLabel/FloatLabel.vue";
export type { FloatLabelProps } from "./components/FloatLabel/types";
export { default as MFluid } from "./components/Fluid/Fluid.vue";
export type { FluidProps } from "./components/Fluid/types";
export { M_FORM_ERRORS_KEY, M_FORM_KEY } from "./components/Form/context";
export type {
  FormFieldValidator,
  MFormContext,
  MFormFieldRegistration,
} from "./components/Form/context";
export { default as MForm } from "./components/Form/Form.vue";
export { default as MFormItem } from "./components/Form/FormItem.vue";
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
export { default as MGallery } from "./components/Gallery/Gallery.vue";
export type { GalleryEmits, GalleryProps } from "./components/Gallery/types";
export { default as MGrid } from "./components/Grid/Grid.vue";
export { default as MGridItem } from "./components/Grid/GridItem.vue";
export { default as MGi } from "./components/Grid/GridItem.vue";
export type {
  GridItemProps,
  GridProps,
  GridResponsive,
} from "./components/Grid/types";
export { M_GRID_KEY } from "./components/Grid/types";
export { default as MIcon } from "./components/Icon/Icon.vue";
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
export { default as MIconField } from "./components/IconField/IconField.vue";
export type { IconFieldProps } from "./components/IconField/types";
export { default as MInplace } from "./components/Inplace/Inplace.vue";
export type { InplaceEmits, InplaceProps } from "./components/Inplace/types";
export { default as MInput } from "./components/Input/Input.vue";
export type { InputEmits, InputProps } from "./components/Input/types";
export { default as MInputColor } from "./components/InputColor/InputColor.vue";
export type {
  InputColorEmits,
  InputColorProps,
} from "./components/InputColor/types";
export { default as MInputGroup } from "./components/InputGroup/InputGroup.vue";
export { default as MInputGroupAddon } from "./components/InputGroup/InputGroupAddon.vue";
export type {
  InputGroupAddonProps,
  InputGroupProps,
} from "./components/InputGroup/types";
export { default as MInputNumber } from "./components/InputNumber/InputNumber.vue";
export type {
  InputNumberButtonPlacement,
  InputNumberEmits,
  InputNumberProps,
} from "./components/InputNumber/types";
export { default as MInputOtp } from "./components/InputOtp/InputOtp.vue";
export type { InputOtpEmits, InputOtpProps } from "./components/InputOtp/types";
export { default as MInputPassword } from "./components/InputPassword/InputPassword.vue";
export type {
  InputPasswordEmits,
  InputPasswordProps,
  InputPasswordSlots,
  PasswordStrength,
  MShowPasswordOn,
} from "./components/InputPassword/types";
export { default as MInputTags } from "./components/InputTags/InputTags.vue";
export type {
  InputTagsEmits,
  InputTagsProps,
} from "./components/InputTags/types";
export { default as MKnob } from "./components/Knob/Knob.vue";
export type { KnobEmits, KnobProps } from "./components/Knob/types";
export { default as MLabel } from "./components/Label/Label.vue";
export type { LabelProps } from "./components/Label/types";
export { M_LAYOUT_KEY } from "./components/Layout/context";
export { default as MLayout } from "./components/Layout/Layout.vue";
export { default as MLayoutContent } from "./components/Layout/LayoutContent.vue";
export { default as MLayoutFooter } from "./components/Layout/LayoutFooter.vue";
export { default as MLayoutHeader } from "./components/Layout/LayoutHeader.vue";
export { default as MLayoutSider } from "./components/Layout/LayoutSider.vue";
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
export { default as MListbox } from "./components/Listbox/Listbox.vue";
export type {
  ListboxEmits,
  ListboxOption,
  ListboxProps,
  ListboxValue,
} from "./components/Listbox/types";
export { default as MMegaMenu } from "./components/MegaMenu/MegaMenu.vue";
export type { MegaMenuItem, MegaMenuProps } from "./components/MegaMenu/types";
export { default as MMenu } from "./components/Menu/Menu.vue";
export type { MenuEmits, MenuItem, MenuProps } from "./components/Menu/types";
export { default as MMenubar } from "./components/Menubar/Menubar.vue";
export type {
  MenubarEmits,
  MenubarItem,
  MenubarProps,
} from "./components/Menubar/types";
export { message, useMessage } from "./components/Message/message";
export { default as MMessage } from "./components/Message/Message.vue";
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
export { default as MMeterGroup } from "./components/MeterGroup/MeterGroup.vue";
export type {
  MeterGroupItem,
  MeterGroupProps,
} from "./components/MeterGroup/types";
export { default as MOrderList } from "./components/OrderList/OrderList.vue";
export type {
  OrderListEmits,
  OrderListProps,
} from "./components/OrderList/types";
export { default as MPagination } from "./components/Pagination/Pagination.vue";
export type {
  PaginationEmits,
  PaginationInstance,
  PaginationProps,
} from "./components/Pagination/types";
export { default as MPanel } from "./components/Panel/Panel.vue";
export type {
  PanelEmits,
  PanelProps,
  PanelSize,
} from "./components/Panel/types";
export { default as MPickList } from "./components/PickList/PickList.vue";
export type { PickListEmits, PickListProps } from "./components/PickList/types";
export { default as MPopover } from "./components/Popover/Popover.vue";
export type {
  PopoverEmits,
  PopoverPlacement,
  PopoverProps,
  PopoverTrigger,
} from "./components/Popover/types";
export { default as MProgressBar } from "./components/ProgressBar/ProgressBar.vue";
export type {
  ProgressBarMode,
  ProgressBarProps,
  ProgressBarStatus,
  ProgressBarType,
} from "./components/ProgressBar/types";
export { default as MProgressSpinner } from "./components/ProgressSpinner/ProgressSpinner.vue";
export type { ProgressSpinnerProps } from "./components/ProgressSpinner/types";
export { default as MRadio } from "./components/Radio/Radio.vue";
export { default as MRadioGroup } from "./components/Radio/RadioGroup.vue";
export type {
  RadioEmits,
  RadioGroupEmits,
  RadioGroupProps,
  RadioProps,
  RadioSize,
  RadioValue,
} from "./components/Radio/types";
export { default as MRating } from "./components/Rating/Rating.vue";
export type { RatingEmits, RatingProps } from "./components/Rating/types";
export { default as MScrollbar } from "./components/Scrollbar/Scrollbar.vue";
export type {
  ScrollbarAriaOrientation,
  ScrollbarDirection,
  ScrollbarEmits,
  ScrollbarInstance,
  ScrollbarProps,
  ScrollbarScrollPayload,
} from "./components/Scrollbar/types";
export { default as MScrollTop } from "./components/ScrollTop/ScrollTop.vue";
export type {
  ScrollTopProps,
  ScrollTopTarget,
} from "./components/ScrollTop/types";
export { default as MSelect } from "./components/Select/Select.vue";
export type {
  SelectEmits,
  SelectModelValue,
  SelectOption,
  SelectProps,
  SelectSize,
  SelectValue,
} from "./components/Select/types";
export { default as MSelectButton } from "./components/SelectButton/SelectButton.vue";
export type {
  SelectButtonEmits,
  SelectButtonOption,
  SelectButtonProps,
  SelectButtonValue,
} from "./components/SelectButton/types";
export { default as MSidebar } from "./components/Sidebar/Sidebar.vue";
export type { SidebarItem, SidebarProps } from "./components/Sidebar/types";
export { default as MSkeleton } from "./components/Skeleton/Skeleton.vue";
export type {
  SkeletonAnimation,
  SkeletonProps,
  SkeletonShape,
} from "./components/Skeleton/types";
export { default as MSlider } from "./components/Slider/Slider.vue";
export type {
  SliderEmits,
  SliderMarks,
  SliderProps,
} from "./components/Slider/types";
export { default as MSpace } from "./components/Space/Space.vue";
export type {
  SpaceAlign,
  SpaceJustify,
  SpaceProps,
  SpaceSize,
} from "./components/Space/types";
export { default as MSpeedDial } from "./components/SpeedDial/SpeedDial.vue";
export type {
  SpeedDialDirection,
  SpeedDialEmits,
  SpeedDialItem,
  SpeedDialProps,
} from "./components/SpeedDial/types";
export { default as MSplitButton } from "./components/SplitButton/SplitButton.vue";
export type {
  SplitButtonEmits,
  SplitButtonItem,
  SplitButtonProps,
} from "./components/SplitButton/types";
export { default as MSplitter } from "./components/Splitter/Splitter.vue";
export type {
  SplitterEmits,
  SplitterLayout,
  SplitterProps,
  SplitterSize,
} from "./components/Splitter/types";
export { default as MStepper } from "./components/Stepper/Stepper.vue";
export type {
  StepperEmits,
  StepperOrientation,
  StepperProps,
  StepperStatus,
  StepperStep,
} from "./components/Stepper/types";
export { default as MSwitch } from "./components/Switch/Switch.vue";
export type {
  SwitchEmits,
  SwitchProps,
  SwitchSize,
} from "./components/Switch/types";
export { default as MTable } from "./components/Table/Table.vue";
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
export { default as MTabs } from "./components/Tabs/Tabs.vue";
export type {
  TabItem,
  TabsEmits,
  TabsProps,
  TabsType,
} from "./components/Tabs/types";
export { default as MTag } from "./components/Tag/Tag.vue";
export type {
  TagEmits,
  TagProps,
  TagSeverity,
  TagSize,
} from "./components/Tag/types";
export { default as MTerminal } from "./components/Terminal/Terminal.vue";
export type { TerminalEmits, TerminalProps } from "./components/Terminal/types";
export { default as MTextarea } from "./components/Textarea/Textarea.vue";
export type {
  MTextareaAutosize,
  TextareaEmits,
  TextareaInstance,
  TextareaProps,
} from "./components/Textarea/types";
export { default as MTieredMenu } from "./components/TieredMenu/TieredMenu.vue";
export type {
  TieredMenuEmits,
  TieredMenuItem,
  TieredMenuProps,
} from "./components/TieredMenu/types";
export { default as MTimeline } from "./components/Timeline/Timeline.vue";
export type {
  TimelineAlign,
  TimelineEvent,
  TimelineLayout,
  TimelineProps,
  TimelineSeverity,
} from "./components/Timeline/types";
export { toast, useToast } from "./components/Toast/toast";
export { default as MToast } from "./components/Toast/Toast.vue";
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
export { default as MToggleButton } from "./components/ToggleButton/ToggleButton.vue";
export type {
  ToggleButtonEmits,
  ToggleButtonProps,
} from "./components/ToggleButton/types";
export { default as MToolbar } from "./components/Toolbar/Toolbar.vue";
export type { ToolbarProps } from "./components/Toolbar/types";
export { default as MTooltip } from "./components/Tooltip/Tooltip.vue";
export type { TooltipProps } from "./components/Tooltip/types";

export { default as MTree } from "./components/Tree/Tree.vue";
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
export { default as MTreeSelect } from "./components/TreeSelect/TreeSelect.vue";
export type {
  TreeSelectEmits,
  TreeSelectNode,
  TreeSelectProps,
  TreeSelectValue,
} from "./components/TreeSelect/types";
export { default as MTreeTable } from "./components/TreeTable/TreeTable.vue";

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
export { default as MVirtualScroller } from "./components/VirtualScroller/VirtualScroller.vue";
export { enUS, formatLocale, mergeLocale, useMLocale, zhCN } from "./locale";
export type { MLocaleMessages, MLocaleName } from "./locale";
export type { MComponentDefaultMap } from "./shared/componentDefaults";
export {
  createMoryaUI,
  getComponentDefault,
  getComponentDefaults,
  getDefaultMConfig,
  installMoryaUI,
  mergeComponentDefaults,
  mergeMConfig,
  provideMConfig,
  M_CONFIG_KEY,
  resolveConfiguredAppendTo,
  MoryaUI,
  useComponentDefaults,
  useConfiguredGapSize,
  useConfiguredSize,
  useConfiguredVariant,
  useMConfig,
} from "./shared/config";
export type { MInstallerOptions } from "./shared/config";
export { MoryaUI as default } from "./shared/config";
export type { MRenderable } from "./shared/content";
export { renderMContent } from "./shared/content";
export type { MAppendTo, MOverlayMountProps } from "./shared/overlay";
export { isOverlayTeleported, resolveOverlayTeleport } from "./shared/overlay";
export type {
  MInputVariant,
  MSeverity,
  MSize,
  MSizeInput,
  MTagSeverity,
  MToastSeverity,
} from "./shared/types";
export { normalizeSeverity, resolveSizeClass } from "./shared/types";
export { useModalOverlay } from "./shared/useModalOverlay";

export type { UseModalOverlayOptions } from "./shared/useModalOverlay";
export {
  applyDensity,
  applyMotion,
  applyReducedMotionPolicy,
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
