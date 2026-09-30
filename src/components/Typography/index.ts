import './style'
import Link from './Link.vue'
import Paragraph from './Paragraph.vue'
import Text from './Text.vue'
import Title from './Title.vue'
import Typography from './Typography.vue'

export type {
  LinkProps,
  ParagraphProps,
  TextProps,
  TitleLevel,
  TitleProps,
  TypographyCopyable,
  TypographyCopyableConfig,
  TypographyDecorations,
  TypographyEditable,
  TypographyEditableConfig,
  TypographyEllipsis,
  TypographyEllipsisConfig,
  TypographyProps,
  TypographyType,
} from './types'

export { default as MLink } from './Link.vue'
export { default as MParagraph } from './Paragraph.vue'
export { default as MText } from './Text.vue'
export { default as MTitle } from './Title.vue'
export { default as MTypography } from './Typography.vue'

/** Compound access: `MTypography.Title` / `.Text` / `.Paragraph` / `.Link`. */
Object.assign(Typography, {
  Title,
  Text,
  Paragraph,
  Link,
})

export default Typography
