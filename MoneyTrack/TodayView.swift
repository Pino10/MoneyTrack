import SwiftUI

struct TxnRow: View {
    @EnvironmentObject var store: Store
    let t: Txn

    private var tint: Color {
        if t.kind == .transfer { return Theme.accent }
        let n = t.category.unicodeScalars.reduce(0) { $0 + Int($1.value) }
        return Theme.palette[n % Theme.palette.count]
    }

    private var sub: String {
        if t.kind == .transfer { return "Transfer to \(store.walletName(t.toWalletID))" }
        return store.categoryName(t.category) + " · " + store.walletName(t.walletID)
    }

    private var amountText: String {
        switch t.kind {
        case .income: return "+" + Money.fmt(t.amount)
        case .expense: return "-" + Money.fmt(t.amount)
        case .transfer: return Money.fmt(t.amount)
        }
    }

    private var amountColor: Color {
        switch t.kind {
        case .income: return Theme.income
        case .expense: return Color.primary
        case .transfer: return Theme.accent
        }
    }

    var body: some View {
        HStack(spacing: 12) {
            Text(t.kind == .transfer ? "TX" : t.category)
                .font(.system(size: 12, weight: .bold, design: .rounded))
                .foregroundStyle(tint)
                .frame(width: 42, height: 42)
                .background(tint.opacity(0.14), in: Circle())
            VStack(alignment: .leading, spacing: 2) {
                Text(t.memo.isEmpty ? store.categoryName(t.category) : t.memo)
                    .font(.system(size: 16, weight: .medium))
                    .lineLimit(1)
                Text(sub)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }
            Spacer(minLength: 8)
            Text(amountText)
                .font(.num(16))
                .foregroundStyle(amountColor)
                .lineLimit(1)
                .minimumScaleFactor(0.7)
        }
        .contentShape(Rectangle())
    }
}

struct TodayView: View {
    @EnvironmentObject var store: Store
    @EnvironmentObject var ui: UIState

    private var greeting: String {
        let h = Calendar.current.component(.hour, from: Date())
        if h < 12 { return "Good morning" }
        return h < 18 ? "Good afternoon" : "Good evening"
    }

    private var vaultBalance: Double {
        guard let v = store.vault else { return 0 }
        return store.balance(v)
    }

    var body: some View {
        NavigationStack {
            ZStack {
                AppBackground()
                ScrollView {
                    VStack(spacing: 24) {
                        header
                        vaultCard
                        weekCard
                        promptCard
                        storyCard
                        walletsRow
                        recent
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 8)
                    .padding(.bottom, 150)
                }
            }
            .toolbar(.hidden, for: .navigationBar)
        }
    }

    private var header: some View {
        HStack(alignment: .bottom) {
            VStack(alignment: .leading, spacing: 4) {
                Text(Date().formatted(.dateTime.weekday(.wide).day().month(.wide)))
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                Text(greeting)
                    .font(.num(32, .bold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.7)
            }
            Spacer()
            GlassCircleButton(icon: "gearshape") { ui.showSettings = true }
        }
    }

    private var vaultCard: some View {
        Card(radius: 36, padding: 24) {
            VStack(spacing: 14) {
                ZStack {
                    LiquidOrb(level: store.vaultLevel)
                        .frame(width: 190, height: 190)
                    HStack(spacing: 0) {
                        CountUp(target: store.vaultLevel * 100, decimals: false)
                        Text("%")
                    }
                    .font(.num(38, .bold))
                    .offset(y: -34)
                }
                VStack(spacing: 2) {
                    Text("Your Vault").font(.subheadline).foregroundStyle(.secondary)
                    Text(store.settings.currency + " " + Money.fmt(vaultBalance))
                        .font(.num(30, .bold))
                        .lineLimit(1)
                        .minimumScaleFactor(0.6)
                    Text("Goal \(Money.fmt0(store.settings.vaultGoal))")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
            }
            .frame(maxWidth: .infinity)
        }
    }

    private var weekCard: some View {
        let days = store.savedDaysThisWeek()
        let streak = store.savingStreakWeeks()
        let todayIndex = (Store.cal.component(.weekday, from: Date()) + 5) % 7
        let letters = ["M", "T", "W", "T", "F", "S", "S"]
        return Card {
            VStack(alignment: .leading, spacing: 14) {
                HStack {
                    Text("Days you saved").font(.system(size: 17, weight: .semibold))
                    Spacer()
                    Label("\(streak) wk", systemImage: "flame.fill")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(.orange)
                }
                HStack {
                    ForEach(0..<7, id: \.self) { i in
                        VStack(spacing: 6) {
                            ZStack {
                                if days[i] {
                                    Circle().fill(Theme.accent)
                                    Image(systemName: "checkmark").font(.system(size: 14, weight: .bold)).foregroundStyle(.white)
                                } else if i == todayIndex {
                                    Circle().strokeBorder(Theme.accent, style: StrokeStyle(lineWidth: 2, dash: [4, 3]))
                                } else {
                                    Circle().strokeBorder(Color.primary.opacity(0.15), lineWidth: 1.5)
                                }
                            }
                            .frame(width: 34, height: 34)
                            Text(letters[i]).font(.caption2).foregroundStyle(.secondary)
                        }
                        .frame(maxWidth: .infinity)
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var promptCard: some View {
        if let inc = store.pendingIncome() {
            Button {
                ui.payFirst = inc
            } label: {
                Card(radius: 28, padding: 16) {
                    HStack(spacing: 14) {
                        Image(systemName: "arrow.down.circle.fill")
                            .font(.system(size: 30))
                            .foregroundStyle(Theme.income)
                        VStack(alignment: .leading, spacing: 2) {
                            Text("\(store.settings.currency) \(Money.fmt(inc.amount)) arrived")
                                .font(.system(size: 16, weight: .semibold))
                                .lineLimit(1)
                                .minimumScaleFactor(0.7)
                            Text("Pay yourself first?").font(.subheadline).foregroundStyle(.secondary)
                        }
                        Spacer(minLength: 8)
                        Text("Split")
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundStyle(.white)
                            .padding(.horizontal, 18)
                            .padding(.vertical, 10)
                            .background(Theme.accent, in: Capsule())
                    }
                }
            }
            .buttonStyle(.plain)
        }
    }

    private var storyCard: some View {
        Button {
            ui.storyPeriod = .month
            ui.showStory = true
        } label: {
            Card(radius: 28, padding: 16) {
                HStack(spacing: 14) {
                    Image(systemName: "sparkles")
                        .font(.system(size: 22, weight: .semibold))
                        .foregroundStyle(Theme.accent)
                        .frame(width: 44, height: 44)
                        .background(Theme.accent.opacity(0.12), in: Circle())
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Your month in stories").font(.system(size: 16, weight: .semibold))
                        Text("A quick look at where it all went").font(.subheadline).foregroundStyle(.secondary).lineLimit(1)
                    }
                    Spacer(minLength: 8)
                    Image(systemName: "play.fill").foregroundStyle(.secondary)
                }
            }
        }
        .buttonStyle(.plain)
    }

    private var walletsRow: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Wallets").font(.system(size: 20, weight: .bold))
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(store.wallets) { w in
                        VStack(alignment: .leading, spacing: 8) {
                            Image(systemName: w.type.icon).foregroundStyle(Theme.accent)
                            Text(w.name).font(.subheadline).foregroundStyle(.secondary).lineLimit(1)
                            Text(Money.fmt(store.balance(w))).font(.num(17)).lineLimit(1).minimumScaleFactor(0.6)
                        }
                        .padding(16)
                        .frame(width: 158, alignment: .leading)
                        .glass(24)
                    }
                }
            }
        }
    }

    private var recent: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Recent").font(.system(size: 20, weight: .bold))
            Card(padding: 16) {
                VStack(spacing: 14) {
                    if store.txns.isEmpty {
                        Text("Nothing yet. Tap + to add your first transaction, or import a CSV in Settings.")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                    ForEach(Array(store.txns.prefix(6))) { t in
                        TxnRow(t: t)
                    }
                }
            }
        }
    }
}
