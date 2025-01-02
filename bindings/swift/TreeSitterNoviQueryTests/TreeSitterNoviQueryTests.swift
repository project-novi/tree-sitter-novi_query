import XCTest
import SwiftTreeSitter
import TreeSitterNoviQuery

final class TreeSitterNoviQueryTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_novi_query())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading NoviQuery grammar")
    }
}
