import SwiftUI

struct WalletsView: View {
    @EnvironmentObject var store: Store
    @State private var showNew = false
    @State private var confirmDelete: Wallet?

    private var currencies: [String] {
        Array(Set(store.wallets.map { $0.currency })).sorted()
    }

    var body: some View {
        NavigationStack {
            ZStack {
                AppBackground()
                ScrollView {
                    VStack(spacing: 20) {
                        totals
                        ForEach(store.wallets) { w in
                            WalletCard(wallet: w)
                                .contextMenu {
                                    Button(role: .destructive) {
                                        confirmDelete = w
                                    } label: {
                                        Label("Delete wallet", systemImage: "trash")
                                    }
                                }
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 150)
                }
            }
            .navigationTitle("Wallets")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button { showNew = true } label: { Image(systemName: "plus") }
                }
            }
            .sheet(isPresented: $showNew) { NewWalletView() }
            .confirmationDialog("Delete this wallet and its transactions?", isPresented: Binding(
                get: { confirmDelete != nil },
                set: { if !$0 { confirmDelete = nil } }
            ), titleVisibility: .visible) {
                Button("Delete", role: .destructive) {
                    if let w = confirmDelete { store.deleteWallet(w.id) }
                    confirmDelete = nil
                }
                Button("Cancel", role: .cancel) { confirmDelete = nil }
            }
        }
    }

    private var totals: some View {
        Card(radius: 32, padding: 22) {
            VStack(alignment: .leading, spacing: 10) {
                Text("Total balance").font(.subheadline).foregroundStyle(.secondary)
                ForEach(currencies, id: \.self) { cur in
                    let sum = store.wallets
                        .filter { $0.currency == cur && $0.countInTotal }
                        .reduce(0.0) { $0 + store.balance($1) }
                    HStack(alignment: .firstTextBaseline, spacing: 8) {
                        Text(cur).font(.num(17, .medium)).foregroundStyle(.secondary)
                        CountUp(target: sum)
                            .font(.num(36, .bold))
                            .lineLimit(1)
                            .minimumScaleFactor(0.5)
                    }
                }
            }
        }
    }
}

struct WalletCard: View {
    @EnvironmentObject var store: Store
    let wallet: Wallet

    var body: some View {
        let bal = store.balance(wallet)
        return Card(radius: 30, padding: 20) {
            VStack(alignment: .leading, spacing: 14) {
                HStack(spacing: 12) {
                    Image(systemName: wallet.type.icon)
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundStyle(Theme.accent)
                        .frame(width: 42, height: 42)
                        .background(Theme.accent.opacity(0.12), in: Circle())
                    VStack(alignment: .leading, spacing: 2) {
                        Text(wallet.name).font(.system(size: 17, weight: .semibold)).lineLimit(1)
                        Text(wallet.type.title).font(.footnote).foregroundStyle(.secondary)
                    }
                    Spacer(minLength: 8)
                    Text(wallet.currency)
                        .font(.system(size: 12, weight: .semibold))
                        .padding(.horizontal, 10)
                        .padding(.vertical, 5)
                        .background(Color.primary.opacity(0.08), in: Capsule())
                }
                Text(Money.fmt(bal))
                    .font(.num(34, .bold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.5)
                if wallet.type == .savings {
                    let goal = max(1, store.settings.vaultGoal)
                    BarRow(title: "Cushion", value: bal, fraction: bal / goal, color: Theme.accent)
                }
                if !wallet.pockets.isEmpty {
                    VStack(spacing: 8) {
                        ForEach(wallet.pockets) { p in
                            HStack {
                                Text(p.name).font(.system(size: 15, weight: .medium)).lineLimit(1)
                                Spacer(minLength: 8)
                                Text("Target " + Money.fmt0(p.target)).font(.footnote).foregroundStyle(.secondary)
                            }
                            .padding(12)
                            .background(Color.primary.opacity(0.06), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
                        }
                    }
                }
            }
        }
    }
}

struct NewWalletView: View {
    @EnvironmentObject var store: Store
    @Environment(\.dismiss) private var dismiss

    @State private var type: WalletType = .bank
    @State private var currency = "GHS"
    @State private var name = ""
    @State private var pockets: [Pocket] = []
    @State private var countInTotal = true
    @State private var pocketName = ""
    @State private var pocketTarget = ""

    private let currencies = ["GHS", "USD", "EUR", "GBP", "NGN"]
    private var clean: Bool { Store.isClean(name) }

    var body: some View {
        NavigationStack {
            ZStack {
                AppBackground()
                ScrollView {
                    VStack(alignment: .leading, spacing: 22) {
                        section("Type") {
                            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                                ForEach(WalletType.allCases) { t in
                                    Button { type = t } label: {
                                        HStack(spacing: 10) {
                                            Image(systemName: t.icon)
                                            Text(t.title).lineLimit(1).minimumScaleFactor(0.8)
                                            Spacer(minLength: 0)
                                        }
                                        .font(.system(size: 15, weight: .medium))
                                        .foregroundStyle(type == t ? Color.white : Color.primary)
                                        .padding(14)
                                        .background(type == t ? Theme.accent : Color.primary.opacity(0.07), in: RoundedRectangle(cornerRadius: 18, style: .continuous))
                                    }
                                    .buttonStyle(.plain)
                                }
                            }
                        }
                        section("Currency") {
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 8) {
                                    ForEach(currencies, id: \.self) { c in
                                        Button { currency = c } label: {
                                            Text(c)
                                                .font(.system(size: 15, weight: .semibold))
                                                .foregroundStyle(currency == c ? Color.white : Color.primary)
                                                .padding(.horizontal, 18)
                                                .padding(.vertical, 10)
                                                .background(currency == c ? Theme.accent : Color.primary.opacity(0.07), in: Capsule())
                                        }
                                        .buttonStyle(.plain)
                                    }
                                }
                            }
                        }
                        section("Name") {
                            VStack(alignment: .leading, spacing: 6) {
                                TextField("Stanbic Everyday", text: $name)
                                    .padding(16)
                                    .glass(20)
                                Text(name.isEmpty || clean ? "Letters and numbers only, up to 24 characters." : "Use letters and numbers only (2 to 24 characters).")
                                    .font(.footnote)
                                    .foregroundStyle(name.isEmpty || clean ? Color.secondary : Theme.expense)
                            }
                        }
                        section("Pockets") {
                            VStack(spacing: 10) {
                                ForEach(pockets) { p in
                                    HStack {
                                        Text(p.name).lineLimit(1)
                                        Spacer()
                                        Text(Money.fmt0(p.target)).foregroundStyle(.secondary)
                                        Button { pockets.removeAll { $0.id == p.id } } label: {
                                            Image(systemName: "minus.circle.fill").foregroundStyle(Theme.expense)
                                        }
                                        .buttonStyle(.plain)
                                    }
                                    .padding(14)
                                    .glass(18)
                                }
                                HStack(spacing: 8) {
                                    TextField("Pocket name", text: $pocketName).padding(12).glass(16)
                                    TextField("Target", text: $pocketTarget).keyboardType(.decimalPad).frame(width: 90).padding(12).glass(16)
                                    Button(action: addPocket) {
                                        Image(systemName: "plus.circle.fill").font(.system(size: 28)).foregroundStyle(Theme.accent)
                                    }
                                    .buttonStyle(.plain)
                                }
                            }
                        }
                        Toggle("Count in total balance", isOn: $countInTotal).tint(Theme.accent)
                        PrimaryButton(title: "Create wallet", enabled: clean) { create() }
                    }
                    .padding(20)
                }
            }
            .navigationTitle("New wallet")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } } }
        }
    }

    private func section<C: View>(_ title: String, @ViewBuilder content: () -> C) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title.uppercased()).font(.footnote.weight(.semibold)).foregroundStyle(.secondary)
            content()
        }
    }

    private func addPocket() {
        let n = pocketName.trimmingCharacters(in: .whitespaces)
        guard Store.isClean(n) else { return }
        pockets.append(Pocket(name: n, target: Double(pocketTarget) ?? 0))
        pocketName = ""
        pocketTarget = ""
    }

    private func create() {
        let w = Wallet(name: name.trimmingCharacters(in: .whitespaces), type: type, currency: currency,
                       pockets: pockets, countInTotal: countInTotal)
        store.wallets.append(w)
        dismiss()
    }
}
