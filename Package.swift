// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterNoviQuery",
    products: [
        .library(name: "TreeSitterNoviQuery", targets: ["TreeSitterNoviQuery"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterNoviQuery",
            dependencies: [],
            path: ".",
            sources: [
                "src/parser.c",
                // NOTE: if your language has an external scanner, add it here.
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterNoviQueryTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterNoviQuery",
            ],
            path: "bindings/swift/TreeSitterNoviQueryTests"
        )
    ],
    cLanguageStandard: .c11
)
