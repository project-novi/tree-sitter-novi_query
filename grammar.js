/**
 * @file NoviQuery grammar for tree-sitter
 * @author Mivik
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "novi_query",

  extras: $ => [$.comment, /[ \t]/],

  rules: {
    body: $ => seq("{", sep_newline($, $.subject), "}"),

    subject_ref: $ => seq("@", sep1(".", $.tag)),

    subject: $ =>
      seq(
        field("subject", $.tag),
        field("name", optional($.subject_ref)),
        field("identities", optional($.tag_group)),
        field("relation", optional(seq(">", $.subject_ref))),
        field("tags", optional(seq(":", $._tags))),
        field("body", optional($.body))
      ),

    _tags: $ => choice($.tag, $.tag_and, $.tag_or, $.tag_group, $.tag_neg),
    tag_and: $ => prec.left(1, seq($._tags, ",", $._tags)),
    tag_or: $ => prec.left(2, seq($._tags, "/", $._tags)),
    tag_group: $ => seq("(", sep_newline($, $._tags), ")"),
    tag_neg: $ => seq("-", $._tags),

    tag: $ => choice($.tag_plain, $.string),

    tag_plain: _ => token(/[\w·'_][\w·'_\- ]*/),

    string: $ => choice(seq('"', '"'), seq('"', $._string_contents, '"')),
    _string_contents: $ =>
      repeat1(choice($._string_content, $._escape_sequence)),
    _string_content: _ => token.immediate(prec(1, /[^\\"\n]+/)),
    _escape_sequence: _ => token.immediate(seq("\\", /(\"|\\|\/|b|f|n|r|t|u)/)),

    _separator: $ => choice(",", repeat1($._newline)),
    _newline: _ => token("\n"),
    comment: _ => token(seq("#", /.*/)),
  },
});

function sep_newline($, r) {
  return seq(repeat($._newline), repeat(seq(r, repeat($._newline))));
}
function sep1(sep, r) {
  return seq(r, repeat(seq(sep, r)));
}
