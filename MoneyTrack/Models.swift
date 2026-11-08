import SwiftUI

enum WalletType: String, Codable, CaseIterable, Identifiable {
    case bank, card, mobileMoney, cash, savings
    var id: String { rawValue }

    var title: String {
        switch self {
        case .bank: return "Bank account"
        case .card: return "Card"
        case .mobileMoney: return "Mobile money"
        case .cash: return "Cash at hand"
        case .savings: return "Savings vault"
        }
    }

    var icon: String {
        switch self {
        case .bank: return "building.columns"
        case .card: return "creditcard"
        case .mobileMoney: return "iphone"
        case .cash: return "banknote"
        case .savings: return "lock.shield"
        }
    }
}

struct Pocket: Codable, Identifiable, Hashable {
    var id = UUID()
    var name: String
    var target: Double
}

struct Wallet: Codable, Identifiable, Hashable {
    var id = UUID()
    var name: String
    var type: WalletType
    var currency: String
    var pockets: [Pocket] = []
    var countInTotal: Bool = true
}

enum TxnKind: String, Codable, CaseIterable, Identifiable {
    case income, expense, transfer
    var id: String { rawValue }
    var title: String { rawValue.capitalized }
}

struct Txn: Codable, Identifiable, Hashable {
    var id = UUID()
    var date: Date
    var kind: TxnKind
    var category: String
    var amount: Double
    var memo: String
    var walletID: UUID
    var toWalletID: UUID?
    var tag: String = ""
}

struct CategoryDef: Codable, Identifiable, Hashable {
    var code: String
    var name: String
    var income: Bool
    var id: String { code }
}

struct AppSettings: Codable {
    var theme: String = "system"
    var currency: String = "GHS"
    var vaultGoal: Double = 5000
    var payFirstPercent: Double = 10
    var askPayFirst: Bool = true
    var splitDone: [UUID] = []
}

enum Period: String, CaseIterable, Identifiable {
    case month = "This month"
    case quarter = "3 months"
    case all = "All time"
    var id: String { rawValue }

    var start: Date? {
        let cal = Store.cal
        switch self {
        case .month:
            return cal.date(from: cal.dateComponents([.year, .month], from: Date()))
        case .quarter:
            let first = cal.date(from: cal.dateComponents([.year, .month], from: Date())) ?? Date()
            return cal.date(byAdding: .month, value: -2, to: first)
        case .all:
            return nil
        }
    }
}

struct CategoryTotal: Identifiable {
    var code: String
    var amount: Double
    var id: String { code }
}

struct Stats {
    var income = 0.0
    var spend = 0.0
    var byCategory: [CategoryTotal] = []
    var weekday: [Double] = Array(repeating: 0, count: 7)
    var foodCount = 0
    var foodAvg = 0.0
    var transportCount = 0
    var transportAvg = 0.0
    var loansIn = 0.0
    var loansPaid = 0.0
    var saved = 0.0
    var count = 0

    var kept: Double { income - spend }
    var keptRate: Double { income > 0 ? max(0, kept) / income : 0 }
    var savedRate: Double { income > 0 ? saved / income : 0 }
}
