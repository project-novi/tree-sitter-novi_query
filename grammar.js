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
    body: $ => $._expr,

    subject_ref: $ => seq("@", sep1(".", $.tag)),

    subject: $ =>
      seq(
        field("subject", $.tag),
        field("identities", optional($.group)),
        field("name", optional($.subject_ref)),
        choice(
          seq($._subject_relation, optional($._subject_body)),
          $._subject_body
        )
      ),
    _subject_relation: $ =>
      seq(
        ">",
        field("relation", $.subject_ref),
        optional(seq("(", field("context", $.subject_ref), ")"))
      ),
    _subject_body: $ => seq(":", field("body", $._expr)),

    _expr: $ => choice($._atom, $.and_term, $.or_term),
    and_term: $ => sep2(",", choice($.or_term, $._atom)),
    or_term: $ => sep2("/", $._atom),

    _atom: $ => choice($.tag, $.group, $.neg),
    neg: $ => seq("-", $._atom),
    group: $ =>
      seq(
        "(",
        repeat($._newline),
        optional(
          seq(
            sep1(repeat1($._newline), choice($._expr, $.subject)),
            repeat($._newline)
          )
        ),
        ")"
      ),

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

function sep1(sep, r) {
  return seq(r, repeat(seq(sep, r)));
}
function sep2(sep, r) {
  return seq(r, repeat1(seq(sep, r)));
}
