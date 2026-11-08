import SwiftUI

struct AddView: View {
    @EnvironmentObject var store: Store
    @EnvironmentObject var ui: UIState
    @Environment(\.dismiss) private var dismiss

    var editing: Txn? = nil

    @State private var kind: TxnKind = .expense
    @State private var amountText = ""
    @State private var memo = ""
    @State private var category = "FD"
    @State private var walletID: UUID?
    @State private var toWalletID: UUID?
    @State private var date = Date()
    @State private var loaded = false

    private var amount: Double { Double(amountText.replacingOccurrences(of: ",", with: "")) ?? 0 }

    private var valid: Bool {
        guard amount > 0, walletID != nil else { return false }
        if kind == .transfer { return toWalletID != nil && toWalletID != walletID }
        return true
    }

    private var suggestions: [Txn] {
        let typed = memo.trimmingCharacters(in: .whitespaces).lowercased()
        return store.suggestions(matching: memo, kind: kind).filter { $0.memo.lowercased() != typed }
    }

    var body: some View {
        NavigationStack {
            ZStack {
                AppBackground()
                ScrollView {
                    VStack(spacing: 20) {
                        Picker("Type", selection: $kind) {
                            ForEach(TxnKind.allCases) { Text($0.title).tag($0) }
                        }
                        .pickerStyle(.segmented)

                        HStack(alignment: .firstTextBaseline, spacing: 8) {
                            Text(store.settings.currency).font(.num(20, .medium)).foregroundStyle(.secondary)
                            TextField("0.00", text: $amountText)
                                .keyboardType(.decimalPad)
                                .font(.num(52, .bold))
                                .multilineTextAlignment(.center)
                                .minimumScaleFactor(0.5)
                        }
                        .padding(.vertical, 8)

                        Card(padding: 16) {
                            VStack(alignment: .leading, spacing: 12) {
                                TextField("What was it for?", text: $memo)
                                    .font(.system(size: 17))
                                    .submitLabel(.done)
                                if !suggestions.isEmpty {
                                    ScrollView(.horizontal, showsIndicators: false) {
                                        HStack(spacing: 8) {
                                            ForEach(suggestions) { s in
                                                Button { apply(s) } label: {
                                                    Text(s.memo + "  " + Money.fmt0(s.amount))
                                                        .font(.system(size: 13, weight: .medium))
                                                        .lineLimit(1)
                                                        .padding(.horizontal, 12)
                                                        .padding(.vertical, 8)
                                                        .background(Theme.accent.opacity(0.12), in: Capsule())
                                                }
                                                .buttonStyle(.plain)
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        Card(padding: 16) {
                            VStack(spacing: 14) {
                                if kind != .transfer {
                                    HStack {
                                        Text("Category")
                                        Spacer()
                                        Picker("Category", selection: $category) {
                                            ForEach(store.categories(income: kind == .income)) { c in
                                                Text(c.name).tag(c.code)
                                            }
                                        }
                                        .pickerStyle(.menu)
                                    }
                                }
                                HStack {
                                    Text(kind == .transfer ? "From" : "Wallet")
                                    Spacer()
                                    Picker("Wallet", selection: $walletID) {
                                        ForEach(store.wallets) { w in Text(w.name).tag(UUID?.some(w.id)) }
                                    }
                                    .pickerStyle(.menu)
                                }
                                if kind == .transfer {
                                    HStack {
                                        Text("To")
                                        Spacer()
                                        Picker("To", selection: $toWalletID) {
                                            ForEach(store.wallets) { w in Text(w.name).tag(UUID?.some(w.id)) }
                                        }
                                        .pickerStyle(.menu)
                                    }
                                }
                                DatePicker("When", selection: $date)
                            }
                        }

                        PrimaryButton(title: editing == nil ? "Save" : "Save changes", enabled: valid) { save() }
                    }
                    .padding(20)
                }
            }
            .navigationTitle(editing == nil ? "New transaction" : "Edit transaction")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } }
            }
            .onAppear(perform: setup)
            .onChange(of: kind) { _, new in
                switch new {
                case .income: category = "SB"
                case .expense: category = "FD"
                case .transfer: category = "TX"
                }
                if new == .transfer && toWalletID == nil { toWalletID = store.vault?.id }
            }
        }
    }

    private func setup() {
        guard !loaded else { return }
        loaded = true
        if let e = editing {
            kind = e.kind
            amountText = String(format: "%.2f", e.amount)
            memo = e.memo
            category = e.category
            walletID = e.walletID
            toWalletID = e.toWalletID
            date = e.date
        } else {
            walletID = store.wallets.first { $0.type != .savings }?.id ?? store.wallets.first?.id
            toWalletID = store.vault?.id
        }
    }

    private func apply(_ s: Txn) {
        memo = s.memo
        category = s.category
        walletID = s.walletID
        if amountText.isEmpty { amountText = String(format: "%.2f", s.amount) }
    }

    private func save() {
        guard let wid = walletID else { return }
        let cat = kind == .transfer ? "TX" : category
        let to = kind == .transfer ? toWalletID : nil
        if var e = editing {
            e.kind = kind
            e.amount = amount
            e.memo = memo
            e.category = cat
            e.walletID = wid
            e.toWalletID = to
            e.date = date
            store.update(e)
            dismiss()
            return
        }
        let t = Txn(date: date, kind: kind, category: cat, amount: amount, memo: memo, walletID: wid, toWalletID: to)
        store.add(t)
        dismiss()
        if kind == .income && cat != "LR" && store.settings.askPayFirst {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) { ui.payFirst = t }
        }
    }
}
