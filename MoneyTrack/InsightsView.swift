import SwiftUI
import Charts

private let dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
private let dayLetters = ["M", "T", "W", "T", "F", "S", "S"]

struct InsightsView: View {
    @EnvironmentObject var store: Store
    @EnvironmentObject var ui: UIState
    @State private var period: Period = .month

    var body: some View {
        let stats = store.stats(from: period.start)
        return NavigationStack {
            ZStack {
                AppBackground()
                ScrollView {
                    VStack(spacing: 20) {
                        Picker("Period", selection: $period) {
                            ForEach(Period.allCases) { Text($0.rawValue).tag($0) }
                        }
                        .pickerStyle(.segmented)

                        Button {
                            ui.storyPeriod = period
                            ui.showStory = true
                        } label: {
                            HStack(spacing: 10) {
                                Image(systemName: "play.circle.fill").font(.system(size: 24))
                                Text("Play my story").font(.system(size: 17, weight: .semibold))
                                Spacer()
                            }
                            .foregroundStyle(.white)
                            .padding(16)
                            .background(Theme.accent, in: RoundedRectangle(cornerRadius: 24, style: .continuous))
                        }
                        .buttonStyle(.plain)

                        Group {
                            inOutCard(stats)
                            MonthlyChart(points: store.monthly(last: 6))
                            CategoriesCard(stats: stats)
                            WeekdayCard(stats: stats)
                            habitsCard(stats)
                            if stats.loansIn > 0 { loansCard(stats) }
                        }
                    }
                    .id(period)
                    .padding(.horizontal, 20)
                    .padding(.bottom, 150)
                }
            }
            .navigationTitle("Insights")
        }
    }

    private func inOutCard(_ s: Stats) -> some View {
        Card(radius: 32, padding: 22) {
            HStack(spacing: 18) {
                VStack(alignment: .leading, spacing: 14) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Money in").font(.footnote).foregroundStyle(.secondary)
                        CountUp(target: s.income, decimals: false).font(.num(24, .bold)).foregroundStyle(Theme.income).lineLimit(1).minimumScaleFactor(0.6)
                    }
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Money out").font(.footnote).foregroundStyle(.secondary)
                        CountUp(target: s.spend, decimals: false).font(.num(24, .bold)).lineLimit(1).minimumScaleFactor(0.6)
                    }
                }
                Spacer(minLength: 0)
                ZStack {
                    RingView(progress: s.keptRate, lineWidth: 12, color: Theme.income)
                    VStack(spacing: 0) {
                        Text("\(Int((s.keptRate * 100).rounded()))%").font(.num(22, .bold))
                        Text("kept").font(.caption2).foregroundStyle(.secondary)
                    }
                }
                .frame(width: 104, height: 104)
            }
        }
    }

    private func habitsCard(_ s: Stats) -> some View {
        HStack(spacing: 14) {
            habitTile(icon: "fork.knife", title: "Food and dining", count: s.foodCount, avg: s.foodAvg)
            habitTile(icon: "bus", title: "Transport", count: s.transportCount, avg: s.transportAvg)
        }
    }

    private func habitTile(icon: String, title: String, count: Int, avg: Double) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Image(systemName: icon).foregroundStyle(Theme.accent).font(.system(size: 18, weight: .semibold))
            CountUp(target: Double(count), decimals: false).font(.num(30, .bold))
            Text(title).font(.footnote).foregroundStyle(.secondary).lineLimit(1)
            Text("Avg " + Money.fmt(avg)).font(.caption).foregroundStyle(.secondary).lineLimit(1)
        }
        .padding(18)
        .frame(maxWidth: .infinity, alignment: .leading)
        .glass(26)
    }

    private func loansCard(_ s: Stats) -> some View {
        Card(radius: 28, padding: 20) {
            VStack(alignment: .leading, spacing: 14) {
                Text("Loans").font(.system(size: 17, weight: .semibold))
                BarRow(title: "Borrowed", value: s.loansIn, fraction: 1, color: Theme.palette[3])
                BarRow(title: "Repaid", value: s.loansPaid, fraction: s.loansIn > 0 ? s.loansPaid / s.loansIn : 0, color: Theme.income)
            }
        }
    }
}

struct MonthlyChart: View {
    let points: [Store.MonthPoint]
    @State private var progress = 0.0

    var body: some View {
        Card(radius: 28, padding: 20) {
            VStack(alignment: .leading, spacing: 12) {
                Text("Last 6 months").font(.system(size: 17, weight: .semibold))
                Chart {
                    ForEach(points) { p in
                        BarMark(x: .value("Month", p.month, unit: .month), y: .value("In", p.income * progress))
                            .foregroundStyle(Theme.income)
                            .position(by: .value("Series", "In"))
                        BarMark(x: .value("Month", p.month, unit: .month), y: .value("Out", p.spend * progress))
                            .foregroundStyle(Theme.expense)
                            .position(by: .value("Series", "Out"))
                    }
                }
                .chartXAxis {
                    AxisMarks(values: .stride(by: .month)) { _ in
                        AxisValueLabel(format: .dateTime.month(.narrow))
                    }
                }
                .frame(height: 190)
                HStack(spacing: 14) {
                    Label("In", systemImage: "circle.fill").foregroundStyle(Theme.income)
                    Label("Out", systemImage: "circle.fill").foregroundStyle(Theme.expense)
                }
                .font(.caption)
                .labelStyle(.titleAndIcon)
            }
        }
        .onAppear { withAnimation(.easeOut(duration: 1.3)) { progress = 1 } }
    }
}

struct DonutView: View {
    let slices: [(color: Color, value: Double)]
    @State private var shown = 0.0

    var body: some View {
        let total = max(1, slices.reduce(0) { $0 + $1.value })
        return ZStack {
            ForEach(0..<slices.count, id: \.self) { i in
                let start = slices[0..<i].reduce(0) { $0 + $1.value } / total
                let end = start + slices[i].value / total
                Circle()
                    .trim(from: start, to: max(start, end - 0.004))
                    .stroke(slices[i].color, style: StrokeStyle(lineWidth: 22, lineCap: .butt))
                    .rotationEffect(.degrees(-90))
            }
        }
        .mask(
            Circle()
                .trim(from: 0, to: shown)
                .stroke(Color.black, style: StrokeStyle(lineWidth: 40))
                .rotationEffect(.degrees(-90))
        )
        .padding(11)
        .onAppear { withAnimation(.easeOut(duration: 1.5)) { shown = 1 } }
    }
}

struct CategoriesCard: View {
    @EnvironmentObject var store: Store
    let stats: Stats

    private var top: [CategoryTotal] { Array(stats.byCategory.prefix(6)) }

    private func color(_ i: Int) -> Color { Theme.palette[i % Theme.palette.count] }

    var body: some View {
        let maxV = max(1, top.first?.amount ?? 1)
        Card(radius: 28, padding: 20) {
            VStack(alignment: .leading, spacing: 16) {
                Text("Where it went").font(.system(size: 17, weight: .semibold))
                if top.isEmpty {
                    Text("No spending in this period yet.").font(.subheadline).foregroundStyle(.secondary)
                } else {
                    HStack {
                        Spacer()
                        DonutView(slices: top.enumerated().map { (color: color($0.offset), value: $0.element.amount) })
                            .frame(width: 150, height: 150)
                        Spacer()
                    }
                    ForEach(Array(top.enumerated()), id: \.element.id) { i, c in
                        BarRow(title: store.categoryName(c.code), value: c.amount, fraction: c.amount / maxV, color: color(i))
                    }
                }
            }
        }
    }
}

struct WeekdayCard: View {
    let stats: Stats
    @State private var shown = 0.0

    var body: some View {
        let maxV = max(1, stats.weekday.max() ?? 1)
        let peak = stats.weekday.firstIndex(of: stats.weekday.max() ?? 0) ?? 0
        Card(radius: 28, padding: 20) {
            VStack(alignment: .leading, spacing: 14) {
                Text("Day to day spending").font(.system(size: 17, weight: .semibold))
                HStack(alignment: .bottom, spacing: 10) {
                    ForEach(0..<7, id: \.self) { i in
                        VStack(spacing: 6) {
                            Capsule()
                                .fill(i == peak ? Theme.expense : Theme.accent.opacity(0.35))
                                .frame(height: max(6, 100 * (stats.weekday[i] / maxV) * shown))
                            Text(dayLetters[i]).font(.caption2).foregroundStyle(.secondary)
                        }
                        .frame(maxWidth: .infinity)
                    }
                }
                .frame(height: 124, alignment: .bottom)
                if stats.weekday.max() ?? 0 > 0 {
                    Text("\(dayNames[peak])s are your biggest day.").font(.footnote).foregroundStyle(.secondary)
                }
            }
        }
        .onAppear { withAnimation(.easeOut(duration: 1.2)) { shown = 1 } }
    }
}
