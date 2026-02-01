import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, fonts, spacing} from '../theme';

/**
 * Lightweight HTML-to-RN renderer.
 * Supports: <b>, <strong>, <i>, <em>, <br>, <p>, <div>, <blockquote>.
 * <i> = semplice corsivo visuale
 * <em> = enfasi semantica (corsivo + colore accent)
 */

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n));
}

function parseInline(html) {
  if (!html) return [];

  const tokens = [];
  const tagRegex = /<\/?(?:b|strong|i|em|u|span|a)(?:\s[^>]*)?>|[^<]+|<[^>]+>/gi;
  const stack = [];
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const chunk = match[0];

    if (/^<(b|strong)[\s>]/i.test(chunk)) {
      stack.push('bold');
    } else if (/^<\/(b|strong)>/i.test(chunk)) {
      const idx = stack.lastIndexOf('bold');
      if (idx !== -1) stack.splice(idx, 1);
    } else if (/^<i[\s>]/i.test(chunk)) {
      stack.push('i');
    } else if (/^<\/i>/i.test(chunk)) {
      const idx = stack.lastIndexOf('i');
      if (idx !== -1) stack.splice(idx, 1);
    } else if (/^<em[\s>]/i.test(chunk)) {
      stack.push('em');
    } else if (/^<\/em>/i.test(chunk)) {
      const idx = stack.lastIndexOf('em');
      if (idx !== -1) stack.splice(idx, 1);
    } else if (!chunk.startsWith('<')) {
      const text = decodeEntities(chunk);
      if (text) {
        tokens.push({
          text,
          bold: stack.includes('bold'),
          i: stack.includes('i'),
          em: stack.includes('em'),
        });
      }
    }
  }

  return tokens;
}

function cleanBlock(str) {
  return str
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(?:p|div|li)>\s*/gi, '\n')
    .replace(/<(?:p|div|li)(?:\s[^>]*)?>/gi, '')
    .replace(/<\/?(?:ul|ol)(?:\s[^>]*)?>/gi, '')
    .trim();
}

function parseBlocks(html) {
  if (!html) return [];

  let str = html.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const blocks = [];
  const bqRegex = /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi;
  let lastIndex = 0;
  let bqMatch;

  while ((bqMatch = bqRegex.exec(str)) !== null) {
    if (bqMatch.index > lastIndex) {
      const before = str.substring(lastIndex, bqMatch.index);
      splitParagraphs(before).forEach(b => blocks.push(b));
    }
    blocks.push({type: 'blockquote', content: cleanBlock(bqMatch[1])});
    lastIndex = bqMatch.index + bqMatch[0].length;
  }

  if (lastIndex < str.length) {
    splitParagraphs(str.substring(lastIndex)).forEach(b => blocks.push(b));
  }

  if (blocks.length === 0) {
    return splitParagraphs(str);
  }

  return blocks.filter(b => b.content);
}

function splitParagraphs(str) {
  str = cleanBlock(str);
  if (!str) return [];

  const rawBlocks = str.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);

  if (rawBlocks.length > 1) {
    return rawBlocks.map(b => ({type: 'paragraph', content: b}));
  }

  if (rawBlocks.length === 1) {
    return [{type: 'paragraph', content: rawBlocks[0]}];
  }

  return [];
}

function renderInlineTokens(tokens) {
  return tokens.map((token, ti) => {
    const hasStyle = token.bold || token.i || token.em;
    if (!hasStyle) return token.text;

    const tokenStyle = {};
    if (token.bold) tokenStyle.fontFamily = fonts.bodySemiBold;
    if (token.i) tokenStyle.fontStyle = 'italic';
    if (token.em) {
      tokenStyle.fontStyle = 'italic';
      tokenStyle.fontFamily = fonts.bodyMedium;
    }

    return (
      <Text key={ti} style={tokenStyle}>
        {token.text}
      </Text>
    );
  });
}

export default function HtmlText({html, style}) {
  const blocks = parseBlocks(html);

  if (blocks.length === 0) return null;

  return (
    <View>
      {blocks.map((block, bi) => {
        const isLast = bi === blocks.length - 1;
        const tokens = parseInline(block.content);
        if (tokens.length === 0) return null;

        if (block.type === 'blockquote') {
          return (
            <View key={bi} style={[styles.blockquote, !isLast && {marginBottom: spacing.md}]}>
              <Text style={[style, styles.blockquoteText]}>
                {renderInlineTokens(tokens)}
              </Text>
            </View>
          );
        }

        return (
          <Text key={bi} style={[style, !isLast && {marginBottom: spacing.xl}]}>
            {renderInlineTokens(tokens)}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    backgroundColor: 'rgba(166,125,81,0.06)',
    borderRadius: 6,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  blockquoteText: {
    fontStyle: 'italic',
    opacity: 0.9,
  },
});
