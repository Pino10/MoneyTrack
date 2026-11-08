import SwiftUI

struct Snapshot: Codable {
    var wallets: [Wallet]
    var txns: [Txn]
    var categories: [CategoryDef]
    var settings: AppSettings
}

final class Store: ObservableObject {
    static var cal: Calendar = {
        var c = Calendar(identifier: .gregorian)
        c.firstWeekday = 2
        return c
    }()

    static let defaultCategories: [CategoryDef] = [
        CategoryDef(code: "SV", name: "Savings", income: false),
        CategoryDef(code: "SG", name: "Shopping and Gadgets", income: false),
        CategoryDef(code: "FD", name: "Food and Dining", income: false),
        CategoryDef(code: "FG", name: "Family and Giving", income: false),
        CategoryDef(code: "HB", name: "Home and Bills", income: false),
        CategoryDef(code: "DL", name: "Debt and Loans", income: false),
        CategoryDef(code: "TR", name: "Transport and Travel", income: false),
        CategoryDef(code: "SU", name: "Subscriptions", income: false),
        CategoryDef(code: "HL", name: "Health and Learning", income: false),
        CategoryDef(code: "FM", name: "Fees and Misc", income: false),
        CategoryDef(code: "SB", name: "Salary and Bonuses", income: true),
        CategoryDef(code: "AS", name: "Allowances and Side Income", income: true),
        CategoryDef(code: "GC", name: "Gifts and Contributions", income: true),
        CategoryDef(code: "LR", name: "Loans Received", income: true)
    ]

    @Published var wallets: [Wallet] = [] { didSet { rebuild(); scheduleSave() } }
    @Published var txns: [Txn] = [] { didSet { rebuild(); scheduleSave() } }
    @Published var categories: [CategoryDef] = Store.defaultCategories { didSet { scheduleSave() } }
    @Published var settings = AppSettings() { didSet { scheduleSave() } }
    @Published private(set) var balances: [UUID: Double] = [:]

    private var saveItem: DispatchWorkItem?
    private let fileURL: URL = FileManager.default
        .urls(for: .documentDirectory, in: .userDomainMask)[0]
        .appendingPathComponent("moneytrack.json")

    init() {
        load()
        if wallets.isEmpty {
            wallets = [
                Wallet(name: "Savings", type: .savings, currency: "GHS"),
                Wallet(name: "Cash at hand", type: .cash, currency: "GHS")
            ]
        }
    }

    // MARK: Persistence

    private func load() {
        guard let data = try? Data(contentsOf: fileURL),
              let snap = try? JSONDecoder().decode(Snapshot.self, from: data) else { return }
        wallets = snap.wallets
        txns = snap.txns
        categories = snap.categories
        settings = snap.settings
    }

    private func scheduleSave() {
        saveItem?.cancel()
        let item = DispatchWorkItem { [weak self] in self?.saveNow() }
        saveItem = item
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.6, execute: item)
    }

    private func saveNow() {
        let snap = Snapshot(wallets: wallets, txns: txns, categories: categories, settings: settings)
        let url = fileURL
        DispatchQueue.global(qos: .utility).async {
            if let data = try? JSONEncoder().encode(snap) {
                try? data.write(to: url, options: .atomic)
            }
        }
    }

    private func rebuild() {
        var b: [UUID: Double] = [:]
        for t in txns {
            switch t.kind {
            case .income:
                b[t.walletID, default: 0] += t.amount
            case .expense:
                b[t.walletID, default: 0] -= t.amount
            case .transfer:
                b[t.walletID, default: 0] -= t.amount
                if let to = t.toWalletID { b[to, default: 0] += t.amount }
            }
        }
        balances = b
    }

    // MARK: Lookups

    var scheme: ColorScheme? {
        switch settings.theme {
        case "light": return .light
        case "dark": return .dark
        default: return nil
        }
    }

    func wallet(_ id: UUID?) -> Wallet? {
        guard let id = id else { return nil }
        return wallets.first { $0.id == id }
    }

    func walletName(_ id: UUID?) -> String { wallet(id)?.name ?? "Unknown" }

    func categoryName(_ code: String) -> String {
        if code == "TX" { return "Transfer" }
        return categories.first { $0.code == code }?.name ?? code
    }

    func categories(income: Bool) -> [CategoryDef] { categories.filter { $0.income == income } }

    func balance(_ w: Wallet) -> Double { balances[w.id] ?? 0 }

    var vault: Wallet? { wallets.first { $0.type == .savings } }

    func ensureVault() -> Wallet {
        if let v = vault { return v }
        let v = Wallet(name: "Savings", type: .savings, currency: settings.currency)
        wallets.append(v)
        return v
    }

    var totalBalance: Double {
        wallets.filter { $0.countInTotal && $0.currency == settings.currency }
            .reduce(0) { $0 + balance($1) }
    }

    var vaultLevel: Double {
        guard let v = vault, settings.vaultGoal > 0 else { return 0 }
        return min(1, max(0, balance(v) / settings.vaultGoal))
    }

    // MARK: Editing

    func add(_ t: Txn) {
        txns.append(t)
        txns.sort { $0.date > $1.date }
    }

    func update(_ t: Txn) {
        if let i = txns.firstIndex(where: { $0.id == t.id }) { txns[i] = t }
        txns.sort { $0.date > $1.date }
    }

    func delete(_ ids: Set<UUID>) { txns.removeAll { ids.contains($0.id) } }

    func deleteWallet(_ id: UUID) {
        txns.removeAll { $0.walletID == id || $0.toWalletID == id }
        wallets.removeAll { $0.id == id }
    }

    func wipe() {
        txns = []
        wallets = [
            Wallet(name: "Savings", type: .savings, currency: "GHS"),
            Wallet(name: "Cash at hand", type: .cash, currency: "GHS")
        ]
        categories = Store.defaultCategories
        settings = AppSettings()
    }

    static func isClean(_ s: String) -> Bool {
        let t = s.trimmingCharacters(in: .whitespaces)
        guard t.count >= 2, t.count <= 24 else { return false }
        return t.unicodeScalars.allSatisfy { CharacterSet.alphanumerics.contains($0) || $0 == " " }
    }

    func makeCode(for name: String) -> String {
        let letters = name.split(separator: " ").compactMap { $0.first }.map { String($0).uppercased() }.joined()
        var base = String(letters.prefix(2))
        if base.count < 2 { base = String(name.prefix(2)).uppercased() }
        var code = base
        var n = 2
        while categories.contains(where: { $0.code == code }) || code == "TX" {
            code = base + String(n)
            n += 1
        }
        return code
    }

    // MARK: Smart add

    func suggestions(matching text: String, kind: TxnKind) -> [Txn] {
        let q = text.trimmingCharacters(in: .whitespaces).lowercased()
        var seen = Set<String>()
        var out: [Txn] = []
        for t in txns where t.kind == kind && !t.memo.isEmpty {
            let m = t.memo.lowercased()
            if !q.isEmpty && !m.contains(q) { continue }
            if seen.insert(m).inserted {
                out.append(t)
                if out.count == 5 { break }
            }
        }
        return out
    }

    // MARK: Habit helpers

    func isSavingAction(_ t: Txn) -> Bool {
        if t.kind == .expense && t.category == "SV" { return true }
        if t.kind == .transfer, let to = wallet(t.toWalletID), to.type == .savings { return true }
        return false
    }

    func savedDaysThisWeek() -> [Bool] {
        let cal = Store.cal
        guard let week = cal.dateInterval(of: .weekOfYear, for: Date()) else { return Array(repeating: false, count: 7) }
        var out = Array(repeating: false, count: 7)
        for t in txns where t.date >= week.start && t.date < week.end && isSavingAction(t) {
            let i = (cal.component(.weekday, from: t.date) + 5) % 7
            out[i] = true
        }
        return out
    }

    func savingStreakWeeks() -> Int {
        let cal = Store.cal
        var weeks = Set<Date>()
        for t in txns where isSavingAction(t) {
            if let s = cal.dateInterval(of: .weekOfYear, for: t.date)?.start { weeks.insert(s) }
        }
        guard var w = cal.dateInterval(of: .weekOfYear, for: Date())?.start else { return 0 }
        if !weeks.contains(w) {
            guard let prev = cal.date(byAdding: .weekOfYear, value: -1, to: w) else { return 0 }
            w = prev
        }
        var n = 0
        while weeks.contains(w) {
            n += 1
            guard let prev = cal.date(byAdding: .weekOfYear, value: -1, to: w) else { break }
            w = prev
        }
        return n
    }

    func pendingIncome() -> Txn? {
        let cutoff = Date().addingTimeInterval(-7 * 86400)
        return txns.first {
            $0.kind == .income && $0.category != "LR" && $0.date > cutoff && $0.date <= Date().addingTimeInterval(60)
                && !settings.splitDone.contains($0.id)
        }
    }

    // MARK: Analytics

    func stats(from start: Date?, to end: Date? = nil) -> Stats {
        var s = Stats()
        var totals: [String: Double] = [:]
        var foodSum = 0.0, transSum = 0.0
        let cal = Store.cal
        for t in txns {
            if let st = start, t.date < st { continue }
            if let en = end, t.date >= en { continue }
            if isSavingAction(t) && t.kind == .transfer { s.saved += t.amount }
            switch t.kind {
            case .income:
                s.income += t.amount
                s.count += 1
                if t.category == "LR" { s.loansIn += t.amount }
            case .expense:
                s.spend += t.amount
                s.count += 1
                totals[t.category, default: 0] += t.amount
                if t.category == "SV" { s.saved += t.amount }
                if t.category == "DL" { s.loansPaid += t.amount }
                if t.category == "FD" { s.foodCount += 1; foodSum += t.amount }
                if t.category == "TR" { s.transportCount += 1; transSum += t.amount }
                if t.category != "SV" && t.category != "DL" && t.category != "HB" {
                    s.weekday[(cal.component(.weekday, from: t.date) + 5) % 7] += t.amount
                }
            case .transfer:
                break
            }
        }
        s.byCategory = totals.map { CategoryTotal(code: $0.key, amount: $0.value) }.sorted { $0.amount > $1.amount }
        s.foodAvg = s.foodCount > 0 ? foodSum / Double(s.foodCount) : 0
        s.transportAvg = s.transportCount > 0 ? transSum / Double(s.transportCount) : 0
        return s
    }

    struct MonthPoint: Identifiable {
        var id: Date { month }
        var month: Date
        var income: Double
        var spend: Double
    }

    func monthly(last n: Int) -> [MonthPoint] {
        let cal = Store.cal
        let nowStart = cal.date(from: cal.dateComponents([.year, .month], from: Date())) ?? Date()
        var out: [MonthPoint] = []
        for i in stride(from: n - 1, through: 0, by: -1) {
            guard let m = cal.date(byAdding: .month, value: -i, to: nowStart),
                  let next = cal.date(byAdding: .month, value: 1, to: m) else { continue }
            let s = stats(from: m, to: next)
            out.append(MonthPoint(month: m, income: s.income, spend: s.spend))
        }
        return out
    }

    // MARK: CSV

    static func parseCSV(_ text: String) -> [[String]] {
        var rows: [[String]] = []
        var row: [String] = []
        var field = ""
        var inQuotes = false
        let chars = Array(text)
        var i = 0
        while i < chars.count {
            let c = chars[i]
            if inQuotes {
                if c == "\"" {
                    if i + 1 < chars.count && chars[i + 1] == "\"" {
                        field.append("\"")
                        i += 1
                    } else {
                        inQuotes = false
                    }
                } else {
                    field.append(c)
                }
            } else if c == "\"" {
                inQuotes = true
            } else if c == "," {
                row.append(field)
                field = ""
            } else if c == "\n" || c == "\r\n" || c == "\r" {
                row.append(field)
                rows.append(row)
                row = []
                field = ""
            } else {
                field.append(c)
            }
            i += 1
        }
        if !field.isEmpty || !row.isEmpty {
            row.append(field)
            rows.append(row)
        }
        return rows.filter { !($0.count == 1 && $0[0].isEmpty) }
    }

    static func mapCategory(_ raw: String, income: Bool) -> String {
        let r = raw.trimmingCharacters(in: .whitespaces).lowercased()
        if income {
            if r.hasPrefix("salary") || r.hasPrefix("bonus") { return "SB" }
            if r.hasPrefix("coupon") || r.hasPrefix("side") || r.hasPrefix("allowance") { return "AS" }
            if r.hasPrefix("gift") { return "GC" }
            if r.hasPrefix("loan") { return "LR" }
            return "GC"
        }
        if r.hasPrefix("saving") || r.hasPrefix("emergency") { return "SV" }
        if r.hasPrefix("big purchase") || r.hasPrefix("clothing") { return "SG" }
        if r.hasPrefix("grocer") || r.hasPrefix("entertainment") { return "FD" }
        if r.hasPrefix("support") { return "FG" }
        if r.hasPrefix("housing") || r.hasPrefix("utilit") || r.hasPrefix("moves") { return "HB" }
        if r.hasPrefix("borrow") { return "DL" }
        if r.hasPrefix("transport") || r.hasPrefix("travel") { return "TR" }
        if r.hasPrefix("data") { return "SU" }
        if r.hasPrefix("health") || r.hasPrefix("education") { return "HL" }
        return "FM"
    }

    func importCSV(_ text: String) -> (added: Int, skipped: Int) {
        let rows = Store.parseCSV(text.replacingOccurrences(of: "\u{FEFF}", with: ""))
        guard rows.count > 1 else { return (0, 0) }
        let head = rows[0].map { $0.trimmingCharacters(in: .whitespaces).lowercased() }
        guard let iD = head.firstIndex(of: "date"),
              let iT = head.firstIndex(of: "type"),
              let iC = head.firstIndex(of: "category"),
              let iA = head.firstIndex(of: "amount"),
              let iM = head.firstIndex(of: "memo"),
              let iW = head.firstIndex(of: "wallet") else { return (0, 0) }
        let iCur = head.firstIndex(of: "currency")

        let df = DateFormatter()
        df.locale = Locale(identifier: "en_US_POSIX")
        df.dateFormat = "MM/dd/yyyy h:mm a"

        var ws = wallets
        var all = txns

        func key(_ t: Txn) -> String {
            "\(Int(t.date.timeIntervalSince1970))|\(t.kind.rawValue)|\(Int((t.amount * 100).rounded()))|\(t.memo)|\(t.walletID.uuidString)"
        }
        var seen = Set(all.map { key($0) })
        var added = 0
        var skipped = 0

        for r in rows.dropFirst() {
            let need = max(iD, iT, iC, iA, iM, iW)
            guard r.count > need,
                  let date = df.date(from: r[iD]),
                  let amt = Double(r[iA].trimmingCharacters(in: .whitespaces)) else { skipped += 1; continue }
            let typeText = r[iT].lowercased()
            let kind: TxnKind
            if typeText.hasPrefix("income") { kind = .income }
            else if typeText.hasPrefix("expense") { kind = .expense }
            else { skipped += 1; continue }

            let wname = r[iW].trimmingCharacters(in: .whitespaces)
            var wid: UUID
            if let w = ws.first(where: { $0.name.lowercased() == wname.lowercased() }) {
                wid = w.id
            } else {
                let cur = iCur.flatMap { r.count > $0 ? r[$0] : nil } ?? settings.currency
                let type: WalletType = wname.lowercased().contains("saving") ? .savings : .mobileMoney
                let w = Wallet(name: wname.isEmpty ? "Imported" : wname, type: type, currency: cur.isEmpty ? settings.currency : cur)
                ws.append(w)
                wid = w.id
            }
            let rawCat = r[iC].trimmingCharacters(in: .whitespaces)
            let isIncome = kind == .income
            let exact = categories.first { $0.income == isIncome && $0.name.lowercased() == rawCat.lowercased() }
            let code = exact?.code ?? Store.mapCategory(rawCat, income: isIncome)
            let t = Txn(date: date, kind: kind, category: code,
                        amount: abs(amt), memo: r[iM], walletID: wid, toWalletID: nil, tag: r[iC])
            if seen.insert(key(t)).inserted {
                all.append(t)
                added += 1
            } else {
                skipped += 1
            }
        }
        all.sort { $0.date > $1.date }
        wallets = ws
        txns = all
        return (added, skipped)
    }

    func exportCSV() -> String {
        let df = DateFormatter()
        df.locale = Locale(identifier: "en_US_POSIX")
        df.dateFormat = "MM/dd/yyyy h:mm a"
        func q(_ s: String) -> String { "\"" + s.replacingOccurrences(of: "\"", with: "\"\"") + "\"" }
        var lines = ["\"Date\",\"Type\",\"Category\",\"Amount\",\"Currency\",\"Memo\",\"Wallet\""]
        for t in txns {
            let w = wallet(t.walletID)
            let cur = w?.currency ?? settings.currency
            let d = df.string(from: t.date)
            switch t.kind {
            case .income:
                lines.append([q(d), q("Income"), q(categoryName(t.category)), q(String(format: "%.2f", t.amount)), q(cur), q(t.memo), q(w?.name ?? "")].joined(separator: ","))
            case .expense:
                lines.append([q(d), q("Expense"), q(categoryName(t.category)), q(String(format: "-%.2f", t.amount)), q(cur), q(t.memo), q(w?.name ?? "")].joined(separator: ","))
            case .transfer:
                lines.append([q(d), q("Expense"), q("Transfer"), q(String(format: "-%.2f", t.amount)), q(cur), q(t.memo), q(w?.name ?? "")].joined(separator: ","))
                if let to = wallet(t.toWalletID) {
                    lines.append([q(d), q("Income"), q("Transfer"), q(String(format: "%.2f", t.amount)), q(to.currency), q(t.memo), q(to.name)].joined(separator: ","))
                }
            }
        }
        return lines.joined(separator: "\n")
    }
}
