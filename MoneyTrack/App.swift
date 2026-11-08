import SwiftUI

@main
struct MoneyTrackApp: App {
    @StateObject private var store = Store()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(store)
        }
    }
}

final class UIState: ObservableObject {
    @Published var showAdd = false
    @Published var showStory = false
    @Published var showSettings = false
    @Published var payFirst: Txn?
    @Published var storyPeriod: Period = .month
}

struct ContentView: View {
    @EnvironmentObject var store: Store
    @StateObject private var ui = UIState()

    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            TabView {
                TodayView()
                    .tabItem { Label("Today", systemImage: "drop.fill") }
                WalletsView()
                    .tabItem { Label("Wallets", systemImage: "wallet.pass.fill") }
                InsightsView()
                    .tabItem { Label("Insights", systemImage: "chart.pie.fill") }
                HistoryView()
                    .tabItem { Label("History", systemImage: "list.bullet") }
            }
            Button {
                ui.showAdd = true
            } label: {
                Image(systemName: "plus")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundStyle(.white)
                    .frame(width: 60, height: 60)
                    .background(Theme.accent, in: Circle())
                    .shadow(color: Theme.accent.opacity(0.4), radius: 12, y: 6)
            }
            .buttonStyle(.plain)
            .padding(.trailing, 20)
            .padding(.bottom, 74)
        }
        .environmentObject(ui)
        .preferredColorScheme(store.scheme)
        .sheet(isPresented: $ui.showAdd) { AddView() }
        .sheet(item: $ui.payFirst) { inc in PayFirstView(income: inc) }
        .sheet(isPresented: $ui.showSettings) { SettingsView() }
        .fullScreenCover(isPresented: $ui.showStory) { StoryView() }
    }
}
