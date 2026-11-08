import SwiftUI

private let dayNamesS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

struct StoryView: View {
    @EnvironmentObject var store: Store
    @EnvironmentObject var ui: UIState
    @Environment(\.dismiss) private var dismiss

    @State private var index = 0
    @State private var progress = 0.0
    private let total = 6
    private let seconds = 6.0
    private let timer = Timer.publish(every: 0.05, on: .main, in: .common).autoconnect()

    var body: some View {
        let stats = store.stats(from: ui.storyPeriod.start)
        return ZStack {
            AppBackground()
            slide(stats)
                .id(index)
                .transition(.opacity)
                .padding(.horizontal, 28)
                .padding(.top, 90)
                .padding(.bottom, 40)

            HStack(spacing: 0) {
                Color.clear.contentShape(Rectangle()).onTapGesture { prev() }
                Color.clear.contentShape(Rectangle()).onTapGesture { next() }
            }

            VStack(spacing: 12) {
                HStack(spacing: 5) {
                    ForEach(0..<total, id: \.self) { i in
                        GeometryReader { g in
                            ZStack(alignment: .leading) {
                                Capsule().fill(Color.primary.opacity(0.15))
                                Capsule().fill(Color.primary)
                                    .frame(width: g.size.width * (i < index ? 1 : (i == index ? progress : 0)))
                            }
                        }
                        .frame(height: 4)
                    }
                }
                HStack {
                    Text(ui.storyPeriod.rawValue).font(.system(size: 15, weight: .semibold)).foregroundStyle(.secondary)
                    Spacer()
                    Button { dismiss() } label: {
                        Image(systemName: "xmark")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundStyle(.primary)
                            .frame(width: 38, height: 38)
                            .glass(19)
                    }
                    .buttonStyle(.plain)
                }
                Spacer()
            }
            .padding(.horizontal, 20)
            .padding(.top, 14)
        }
        .onReceive(timer) { _ in
            progress += 0.05 / seconds
            if progress >= 1 { next() }
        }
    }

    @ViewBuilder
    private func slide(_ s: Stats) -> some View {
        switch index {
        case 0: IntroSlide(s: s, period: ui.storyPeriod)
        case 1: InOutSlide(s: s)
        case 2: CategorySlide(s: s)
        case 3: HabitSlide(s: s)
        case 4: DaySlide(s: s)
        default: SavingSlide(s: s) { dismiss() }
        }
    }

    private func next() {
        if index < total - 1 {
            withAnimation(.easeInOut(duration: 0.35)) { index += 1 }
            progress = 0
        } else {
            dismiss()
        }
    }

    private func prev() {
        withAnimation(.easeInOut(duration: 0.35)) { index = max(0, index - 1) }
        progress = 0
    }
}

private struct SlideTitle: View {
    let kicker: String
    let title: String
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(kicker.uppercased()).font(.system(size: 13, weight: .bold)).foregroundStyle(Theme.accent).tracking(1.2)
            Text(title).font(.num(34, .bold)).fixedSize(horizontal: false, vertical: true)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

private struct IntroSlide: View {
    @EnvironmentObject var store: Store
    let s: Stats
    let period: Period

    var body: some View {
        VStack(alignment: .leading, spacing: 28) {
            Spacer()
            SlideTitle(kicker: period.rawValue, title: "Here is where your money went")
            VStack(alignment: .leading, spacing: 6) {
                Text("You spent").foregroundStyle(.secondary)
                HStack(alignment: .firstTextBaseline, spacing: 8) {
                    Text(store.settings.currency).font(.num(22, .medium)).foregroundStyle(.secondary)
                    CountUp(target: s.spend, decimals: false)
                        .font(.num(56, .bold))
                        .lineLimit(1)
                        .minimumScaleFactor(0.4)
                }
                Text("across \(s.count) transactions").foregroundStyle(.secondary)
            }
            Spacer()
        }
    }
}

private struct InOutSlide: View {
    let s: Stats
    @State private var shown = 0.0

    var body: some View {
        let maxV = max(1, max(s.income, s.spend))
        VStack(alignment: .leading, spacing: 28) {
            Spacer()
            SlideTitle(kicker: "In and out", title: s.kept >= 0 ? "You kept a little of it" : "You spent more than came in")
            VStack(alignment: .leading, spacing: 18) {
                bar("In", s.income, Theme.income, maxV)
                bar("Out", s.spend, Theme.expense, maxV)
            }
            Text("Kept \(Int((s.keptRate * 100).rounded()))% of what came in")
                .font(.system(size: 17, weight: .semibold))
            Spacer()
        }
        .onAppear { withAnimation(.easeOut(duration: 1.4)) { shown = 1 } }
    }

    private func bar(_ title: String, _ v: Double, _ c: Color, _ maxV: Double) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(title).font(.system(size: 15, weight: .semibold)).foregroundStyle(.secondary)
                Spacer()
                Text(Money.fmt0(v)).font(.num(20, .bold))
            }
            GeometryReader { g in
                Capsule().fill(c).frame(width: max(8, g.size.width * (v / maxV) * shown))
            }
            .frame(height: 22)
        }
    }
}

private struct CategorySlide: View {
    @EnvironmentObject var store: Store
    let s: Stats

    var body: some View {
        let top = Array(s.byCategory.prefix(5))
        let maxV = max(1, top.first?.amount ?? 1)
        VStack(alignment: .leading, spacing: 28) {
            Spacer()
            SlideTitle(kicker: "Top spending", title: top.first.map { "\(store.categoryName($0.code)) led the way" } ?? "No spending yet")
            VStack(spacing: 18) {
                ForEach(Array(top.enumerated()), id: \.element.id) { i, c in
                    BarRow(title: store.categoryName(c.code), value: c.amount, fraction: c.amount / maxV, color: Theme.palette[i % Theme.palette.count])
                }
            }
            Spacer()
        }
    }
}

private struct HabitSlide: View {
    let s: Stats

    var body: some View {
        VStack(alignment: .leading, spacing: 28) {
            Spacer()
            SlideTitle(kicker: "Habits", title: "The little things add up")
            HStack(spacing: 14) {
                tile("fork.knife", "Food and dining", s.foodCount, s.foodAvg)
                tile("bus", "Transport", s.transportCount, s.transportAvg)
            }
            Spacer()
        }
    }

    private func tile(_ icon: String, _ title: String, _ count: Int, _ avg: Double) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Image(systemName: icon).font(.system(size: 20, weight: .semibold)).foregroundStyle(Theme.accent)
            CountUp(target: Double(count), decimals: false).font(.num(44, .bold))
            Text(title).font(.footnote).foregroundStyle(.secondary).lineLimit(1)
            Text("Avg " + Money.fmt(avg)).font(.caption).foregroundStyle(.secondary).lineLimit(1)
        }
        .padding(18)
        .frame(maxWidth: .infinity, alignment: .leading)
        .glass(26)
    }
}

private struct DaySlide: View {
    let s: Stats
    @State private var shown = 0.0
    private let letters = ["M", "T", "W", "T", "F", "S", "S"]

    var body: some View {
        let maxV = max(1, s.weekday.max() ?? 1)
        let peak = s.weekday.firstIndex(of: s.weekday.max() ?? 0) ?? 0
        VStack(alignment: .leading, spacing: 28) {
            Spacer()
            SlideTitle(kicker: "Your rhythm", title: "\(dayNamesS[peak])s are your biggest day")
            HStack(alignment: .bottom, spacing: 10) {
                ForEach(0..<7, id: \.self) { i in
                    VStack(spacing: 8) {
                        Capsule()
                            .fill(i == peak ? Theme.expense : Theme.accent.opacity(0.35))
                            .frame(height: max(8, 180 * (s.weekday[i] / maxV) * shown))
                        Text(letters[i]).font(.caption).foregroundStyle(.secondary)
                    }
                    .frame(maxWidth: .infinity)
                }
            }
            .frame(height: 210, alignment: .bottom)
            Spacer()
        }
        .onAppear { withAnimation(.easeOut(duration: 1.3)) { shown = 1 } }
    }
}

private struct SavingSlide: View {
    let s: Stats
    let done: () -> Void

    var body: some View {
        VStack(spacing: 28) {
            Spacer()
            SlideTitle(kicker: "Saving", title: s.keptRate < 0.1 ? "Let's aim for 10%" : "Nice, you are saving")
            ZStack {
                RingView(progress: min(1, s.keptRate / 0.1), lineWidth: 18)
                VStack(spacing: 0) {
                    Text("\(Int((s.keptRate * 100).rounded()))%").font(.num(44, .bold))
                    Text("kept of income").font(.footnote).foregroundStyle(.secondary)
                }
            }
            .frame(width: 210, height: 210)
            Text("Ring full means you kept 10% or more.")
                .font(.footnote)
                .foregroundStyle(.secondary)
            PrimaryButton(title: "Back to Today", action: done)
            Spacer()
        }
    }
}
