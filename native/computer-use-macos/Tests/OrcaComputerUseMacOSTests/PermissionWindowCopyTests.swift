@testable import OrcaComputerUseMacOSCore
import XCTest

final class PermissionWindowCopyTests: XCTestCase {
    func testUsesSimplifiedChineseForOrcaChineseLocales() {
        for locale in ["zh", "zh-CN", "zh_Hans_CN"] {
            let copy = PermissionWindowCopy(localeIdentifier: locale)

            XCTAssertEqual(copy.enableTitle, "启用 Orca 计算机使用功能")
            XCTAssertEqual(copy.permissionSubtitle, "授予权限，以便 Orca 在你提出要求时使用应用。")
            XCTAssertEqual(copy.screenshotsTitle, "屏幕截图")
            XCTAssertEqual(copy.screenshotsDetail, "捕获窗口以识别视觉状态")
            XCTAssertEqual(copy.allowButton, "允许")
        }
    }

    func testFallsBackToEnglishForUnsupportedAndTraditionalChineseLocales() {
        for locale in [nil, "fr", "zh-TW", "zh-Hant"] as [String?] {
            let copy = PermissionWindowCopy(localeIdentifier: locale)

            XCTAssertEqual(copy.enableTitle, "Enable Orca Computer Use")
            XCTAssertEqual(copy.screenshotsTitle, "Screenshots")
            XCTAssertEqual(copy.allowButton, "Allow")
        }
    }
}
