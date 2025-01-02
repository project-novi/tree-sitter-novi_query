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

  rules: {s
    query: $ => seq(repeat($._newline), $._query, repeat($._newline)),

    _query: $ => choice($._atom, $.query_and, $.query_or),
    query_and: $ =>
      prec.left(1, seq($._query, choice(",", repeat1($._newline)), $._query)),
    query_or: $ => prec.left(2, seq($._query, "/", $._query)),

    _atom: $ =>
      choice(
        $.atom_tag,
        $.atom_neg,
        $.atom_any,
        $.atom_group,
        $.atom_subject,
        $.atom_relation
      ),
    atom_tag: $ => $.tag,
    atom_neg: $ => seq("-", $._atom),
    atom_any: $ => seq("(", ")"),
    atom_group: $ =>
      seq("(", repeat($._newline), $._query, repeat($._newline), ")"),
    atom_subject: $ => seq($._subject, ":", $._atom),
    atom_relation: $ => seq($._subject, "-", $.tag, "-", $._subject),

    _subject: $ => choice($.subject_any, $.subject_named, $.subject_type_only),
    subject_any: _ => seq("[", "]"),
    subject_named: $ => seq(optional($.tag), seq("[", $.tag, "]")),
    subject_type_only: $ => $.tag,

    tag: $ => choice($.tag_plain, $.string),

    tag_plain: _ => token(/[\w·'_\.][\w·'_\. ]*/),

    string: $ => choice(seq('"', '"'), seq('"', $._string_contents, '"')),
    _string_contents: $ =>
      repeat1(choice($._string_content, $._escape_sequence)),
    _string_content: _ => token.immediate(prec(1, /[^\\"\n]+/)),
    _escape_sequence: _ => token.immediate(seq("\\", /(\"|\\|\/|b|f|n|r|t|u)/)),

    _newline: _ => token("\n"),
    comment: _ => token(seq("#", /.*/)),
  },
});
