import SwiftUI

enum Theme {
    static let accent = Color(red: 0.0, green: 0.48, blue: 1.0)
    static let income = Color(red: 0.16, green: 0.70, blue: 0.42)
    static let expense = Color(red: 1.0, green: 0.35, blue: 0.31)
    static let liquidTop = Color(red: 0.33, green: 0.86, blue: 0.96)
    static let liquidBottom = Color(red: 0.08, green: 0.46, blue: 0.96)
    static let palette: [Color] = [
        Color(red: 0.0, green: 0.48, blue: 1.0),
        Color(red: 0.35, green: 0.34, blue: 0.84),
        Color(red: 0.19, green: 0.69, blue: 0.78),
        Color(red: 1.0, green: 0.62, blue: 0.04),
        Color(red: 1.0, green: 0.35, blue: 0.31),
        Color(red: 0.19, green: 0.78, blue: 0.45),
        Color(red: 0.69, green: 0.32, blue: 0.87),
        Color(red: 0.56, green: 0.56, blue: 0.58)
    ]
}

extension Font {
    static func num(_ size: CGFloat, _ weight: Font.Weight = .semibold) -> Font {
        .system(size: size, weight: weight, design: .rounded)
    }
}

enum Money {
    static let two: NumberFormatter = {
        let f = NumberFormatter()
        f.numberStyle = .decimal
        f.minimumFractionDigits = 2
        f.maximumFractionDigits = 2
        return f
    }()
    static let zero: NumberFormatter = {
        let f = NumberFormatter()
        f.numberStyle = .decimal
        f.maximumFractionDigits = 0
        return f
    }()
    static func fmt(_ v: Double) -> String { two.string(from: NSNumber(value: v)) ?? "0.00" }
    static func fmt0(_ v: Double) -> String { zero.string(from: NSNumber(value: v)) ?? "0" }
}

struct AppBackground: View {
    @Environment(\.colorScheme) private var scheme

    var body: some View {
        ZStack {
            (scheme == .dark ? Color.black : Color.white)
            Circle()
                .fill(Theme.accent.opacity(scheme == .dark ? 0.22 : 0.10))
                .frame(width: 340, height: 340)
                .blur(radius: 80)
                .offset(x: 140, y: -300)
            Circle()
                .fill(Theme.liquidTop.opacity(scheme == .dark ? 0.16 : 0.10))
                .frame(width: 300, height: 300)
                .blur(radius: 80)
                .offset(x: -160, y: 220)
        }
        .ignoresSafeArea()
    }
}

extension View {
    @ViewBuilder
    func glass(_ radius: CGFloat = 28) -> some View {
        #if compiler(>=6.2)
        if #available(iOS 26.0, *) {
            self.glassEffect(.regular, in: RoundedRectangle(cornerRadius: radius, style: .continuous))
        } else {
            self.legacyGlass(radius)
        }
        #else
        self.legacyGlass(radius)
        #endif
    }

    func legacyGlass(_ radius: CGFloat) -> some View {
        self
            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: radius, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: radius, style: .continuous)
                    .strokeBorder(Color.primary.opacity(0.08), lineWidth: 1)
            )
    }
}

struct Card<Content: View>: View {
    var radius: CGFloat = 28
    var padding: CGFloat = 18
    @ViewBuilder var content: Content

    var body: some View {
        content
            .padding(padding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .glass(radius)
    }
}

struct GlassCircleButton: View {
    let icon: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: icon)
                .font(.system(size: 17, weight: .semibold))
                .foregroundStyle(.primary)
                .frame(width: 44, height: 44)
                .glass(22)
        }
        .buttonStyle(.plain)
    }
}

struct PrimaryButton: View {
    let title: String
    var enabled: Bool = true
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 17, weight: .semibold))
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 56)
                .background(enabled ? Theme.accent : Color.gray.opacity(0.5), in: Capsule())
        }
        .buttonStyle(.plain)
        .disabled(!enabled)
    }
}

struct CountingText: View, Animatable {
    var value: Double
    var decimals: Bool = true
    var animatableData: Double {
        get { value }
        set { value = newValue }
    }
    var body: some View {
        Text(decimals ? Money.fmt(value) : Money.fmt0(value))
    }
}

struct CountUp: View {
    let target: Double
    var decimals: Bool = true
    @State private var shown = 0.0

    var body: some View {
        CountingText(value: shown, decimals: decimals)
            .onAppear {
                withAnimation(.easeOut(duration: 1.4)) { shown = target }
            }
            .onChange(of: target) { _, new in
                withAnimation(.easeOut(duration: 1.0)) { shown = new }
            }
    }
}

struct LiquidOrb: View {
    let level: Double
    @State private var from = 0.0
    @State private var target = 0.0
    @State private var start = Date.timeIntervalSinceReferenceDate

    private func current(_ t: Double) -> Double {
        let p = min(1, max(0, (t - start) / 1.8))
        let e = 1 - pow(1 - p, 3)
        return from + (target - from) * e
    }

    var body: some View {
        TimelineView(.animation) { tl in
            let t = tl.date.timeIntervalSinceReferenceDate
            let lvl = current(t)
            Canvas { ctx, size in
                let w = Double(size.width)
                let h = Double(size.height)
                let rect = CGRect(origin: .zero, size: size).insetBy(dx: 3, dy: 3)
                let circle = Path(ellipseIn: rect)
                ctx.stroke(circle, with: .color(Color.primary.opacity(0.18)), lineWidth: 2)
                var inner = ctx
                inner.clip(to: circle)
                let base = h - (h - 12) * min(1, lvl) - 6
                for layer in 0..<2 {
                    var p = Path()
                    p.move(to: CGPoint(x: 0, y: h))
                    let amp = layer == 0 ? 6.0 : 9.0
                    let speed = layer == 0 ? 1.4 : -1.0
                    var x = 0.0
                    while x <= w {
                        let y = base + sin(x / w * Double.pi * 3 + t * speed) * amp
                        p.addLine(to: CGPoint(x: x, y: y))
                        x += 4
                    }
                    p.addLine(to: CGPoint(x: w, y: h))
                    p.closeSubpath()
                    let a = layer == 0 ? 0.5 : 0.95
                    let g = Gradient(colors: [Theme.liquidTop.opacity(a), Theme.liquidBottom.opacity(a)])
                    inner.fill(p, with: .linearGradient(g, startPoint: CGPoint(x: 0, y: base), endPoint: CGPoint(x: 0, y: h)))
                }
            }
        }
        .onAppear {
            target = level
            start = Date.timeIntervalSinceReferenceDate
        }
        .onChange(of: level) { _, new in
            let now = Date.timeIntervalSinceReferenceDate
            from = current(now)
            target = new
            start = now
        }
    }
}

struct RingView: View {
    let progress: Double
    var lineWidth: CGFloat = 14
    var color: Color = Theme.accent
    @State private var shown = 0.0

    var body: some View {
        ZStack {
            Circle().stroke(Color.primary.opacity(0.1), lineWidth: lineWidth)
            Circle()
                .trim(from: 0, to: min(1, max(0.003, shown)))
                .stroke(color, style: StrokeStyle(lineWidth: lineWidth, lineCap: .round))
                .rotationEffect(.degrees(-90))
        }
        .onAppear { withAnimation(.easeOut(duration: 1.4)) { shown = progress } }
    }
}

struct BarRow: View {
    let title: String
    let value: Double
    let fraction: Double
    let color: Color
    @State private var shown = 0.0

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(title).font(.system(size: 15, weight: .medium)).lineLimit(1)
                Spacer(minLength: 8)
                Text(Money.fmt0(value)).font(.num(14)).foregroundStyle(.secondary)
            }
            GeometryReader { g in
                ZStack(alignment: .leading) {
                    Capsule().fill(Color.primary.opacity(0.08))
                    Capsule().fill(color).frame(width: max(6, g.size.width * shown))
                }
            }
            .frame(height: 8)
        }
        .onAppear { withAnimation(.easeOut(duration: 1.2)) { shown = min(1, max(0, fraction)) } }
    }
}
