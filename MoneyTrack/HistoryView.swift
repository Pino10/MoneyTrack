import SwiftUI

struct HistoryView: View {
    @EnvironmentObject var store: Store
    @State private var query = ""
    @State private var filter: TxnKind? = nil
    @State private var editing: Txn?

    private var filtered: [Txn] {
        store.txns.filter { t in
            let kindOK = filter == nil || t.kind == filter
            let textOK = query.isEmpty
                || t.memo.localizedCaseInsensitiveContains(query)
                || store.categoryName(t.category).localizedCaseInsensitiveContains(query)
            return kindOK && textOK
        }
    }

    struct DayGroup: Identifiable {
        let day: Date
        let items: [Txn]
        var id: Date { day }
    }

    private var groups: [DayGroup] {
        let dict = Dictionary(grouping: filtered) { Store.cal.startOfDay(for: $0.date) }
        return dict.keys.sorted(by: >).map { DayGroup(day: $0, items: dict[$0] ?? []) }
    }

    var body: some View {
        NavigationStack {
            List {
                Section {
                    Picker("Type", selection: $filter) {
                        Text("All").tag(TxnKind?.none)
                        Text("Income").tag(TxnKind?.some(.income))
                        Text("Expense").tag(TxnKind?.some(.expense))
                        Text("Transfer").tag(TxnKind?.some(.transfer))
                    }
                    .pickerStyle(.segmented)
                }
                .listRowBackground(Color.clear)
                .listRowSeparator(.hidden)

                ForEach(groups) { g in
                    Section {
                        ForEach(g.items) { t in
                            TxnRow(t: t)
                                .listRowBackground(Color.clear)
                                .onTapGesture { editing = t }
                                .swipeActions {
                                    Button(role: .destructive) {
                                        store.delete([t.id])
                                    } label: {
                                        Label("Delete", systemImage: "trash")
                                    }
                                }
                        }
                    } header: {
                        Text(g.day.formatted(.dateTime.weekday(.wide).day().month(.abbreviated)))
                    }
                }
                Color.clear.frame(height: 90).listRowBackground(Color.clear).listRowSeparator(.hidden)
            }
            .listStyle(.plain)
            .scrollContentBackground(.hidden)
            .background(AppBackground())
            .navigationTitle("History")
            .searchable(text: $query, prompt: "Search notes or categories")
            .sheet(item: $editing) { t in AddView(editing: t) }
        }
    }
}
