import SwiftUI

struct PayFirstView: View {
    @EnvironmentObject var store: Store
    @Environment(\.dismiss) private var dismiss
    let income: Txn

    @State private var percent: Double = 10
    @State private var done = false
    @State private var pulse = false

    private var amount: Double { (income.amount * percent / 100 * 100).rounded() / 100 }
    private var vaultBalance: Double { store.vault.map { store.balance($0) } ?? 0 }
    private var level: Double { min(1, (vaultBalance + (done ? 0 : amount)) / max(1, store.settings.vaultGoal)) }
    private var canMove: Bool { amount > 0 && store.vault?.id != income.walletID }

    var body: some View {
        ZStack {
            AppBackground()
            ScrollView {
                VStack(spacing: 24) {
                    if done { doneView } else { chooseView }
                }
                .padding(20)
                .padding(.top, 20)
            }
        }
        .onAppear { percent = store.settings.payFirstPercent }
    }

    private var chooseView: some View {
        VStack(spacing: 24) {
            VStack(spacing: 6) {
                Text("Pay yourself first").font(.num(30, .bold))
                Text("\(store.settings.currency) \(Money.fmt(income.amount)) just arrived")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            ZStack {
                LiquidOrb(level: level).frame(width: 170, height: 170)
                HStack(spacing: 0) {
                    Text(Money.fmt0(level * 100))
                    Text("%")
                }
                .font(.num(34, .bold))
                .offset(y: -30)
            }
            Card(radius: 30, padding: 20) {
                VStack(alignment: .leading, spacing: 14) {
                    HStack(alignment: .firstTextBaseline) {
                        Text("\(Int(percent))%").font(.num(44, .bold))
                        Spacer()
                        Text(store.settings.currency + " " + Money.fmt(amount))
                            .font(.num(20))
                            .foregroundStyle(Theme.accent)
                            .lineLimit(1)
                            .minimumScaleFactor(0.6)
                    }
                    Slider(value: $percent, in: 0...50, step: 1).tint(Theme.accent)
                    HStack(spacing: 8) {
                        ForEach([5.0, 10.0, 20.0, 30.0], id: \.self) { p in
                            Button { withAnimation { percent = p } } label: {
                                Text("\(Int(p))%")
                                    .font(.system(size: 14, weight: .semibold))
                                    .foregroundStyle(percent == p ? Color.white : Color.primary)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 9)
                                    .background(percent == p ? Theme.accent : Color.primary.opacity(0.08), in: Capsule())
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
            }
            Card(radius: 26, padding: 16) {
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Stays in \(store.walletName(income.walletID))").font(.footnote).foregroundStyle(.secondary)
                        Text(Money.fmt(income.amount - amount)).font(.num(17)).lineLimit(1)
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 2) {
                        Text("To your Vault").font(.footnote).foregroundStyle(.secondary)
                        Text(Money.fmt(amount)).font(.num(17)).foregroundStyle(Theme.accent).lineLimit(1)
                    }
                }
            }
            VStack(spacing: 12) {
                PrimaryButton(title: "Move \(Money.fmt(amount)) to Vault", enabled: canMove) { move() }
                Button("Skip this time") {
                    store.settings.splitDone.append(income.id)
                    dismiss()
                }
                .font(.system(size: 16, weight: .medium))
                .foregroundStyle(.secondary)
            }
        }
    }

    private var doneView: some View {
        VStack(spacing: 24) {
            ZStack {
                ForEach(0..<3, id: \.self) { i in
                    Circle()
                        .stroke(Theme.accent.opacity(0.35), lineWidth: 2)
                        .frame(width: 170, height: 170)
                        .scaleEffect(pulse ? 1.9 : 1)
                        .opacity(pulse ? 0 : 0.7)
                        .animation(.easeOut(duration: 2.4).repeatForever(autoreverses: false).delay(Double(i) * 0.8), value: pulse)
                }
                LiquidOrb(level: level).frame(width: 170, height: 170)
            }
            .onAppear { pulse = true }
            VStack(spacing: 6) {
                Text("You paid yourself first").font(.num(28, .bold)).multilineTextAlignment(.center)
                Text("Vault is now \(store.settings.currency) \(Money.fmt(vaultBalance))")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            Card(radius: 26, padding: 16) {
                HStack(spacing: 12) {
                    Image(systemName: "flame.fill").font(.system(size: 26)).foregroundStyle(.orange)
                    VStack(alignment: .leading, spacing: 2) {
                        Text("\(store.savingStreakWeeks()) week saving streak").font(.system(size: 16, weight: .semibold))
                        Text("Save again next week to keep it going").font(.footnote).foregroundStyle(.secondary)
                    }
                }
            }
            PrimaryButton(title: "Done") { dismiss() }
        }
    }

    private func move() {
        let v = store.ensureVault()
        let t = Txn(date: Date(), kind: .transfer, category: "TX", amount: amount,
                    memo: "Pay yourself first", walletID: income.walletID, toWalletID: v.id)
        store.add(t)
        store.settings.splitDone.append(income.id)
        store.settings.payFirstPercent = percent
        withAnimation(.spring()) { done = true }
    }
}
