import SwiftUI

struct CategoriesView: View {
    @EnvironmentObject var store: Store
    @State private var income = false
    @State private var editing: CategoryDef?
    @State private var adding = false

    var body: some View {
        ZStack {
            AppBackground()
            ScrollView {
                VStack(spacing: 16) {
                    Picker("Kind", selection: $income) {
                        Text("Spending").tag(false)
                        Text("Income").tag(true)
                    }
                    .pickerStyle(.segmented)

                    Text("Names use letters and numbers only, so everything stays clean.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .frame(maxWidth: .infinity, alignment: .leading)

                    ForEach(store.categories(income: income)) { c in
                        Button { editing = c } label: {
                            HStack(spacing: 14) {
                                Text(c.code)
                                    .font(.system(size: 13, weight: .bold, design: .rounded))
                                    .foregroundStyle(Theme.accent)
                                    .frame(width: 42, height: 42)
                                    .background(Theme.accent.opacity(0.12), in: Circle())
                                Text(c.name).font(.system(size: 16, weight: .medium)).lineLimit(1)
                                Spacer(minLength: 8)
                                Image(systemName: "pencil").foregroundStyle(.secondary)
                            }
                            .padding(14)
                            .frame(maxWidth: .infinity)
                            .glass(22)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(20)
            }
        }
        .navigationTitle("Categories")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button { adding = true } label: { Image(systemName: "plus") }
            }
        }
        .sheet(item: $editing) { c in RenameSheet(existing: c, income: c.income) }
        .sheet(isPresented: $adding) { RenameSheet(existing: nil, income: income) }
    }
}

struct RenameSheet: View {
    @EnvironmentObject var store: Store
    @Environment(\.dismiss) private var dismiss
    let existing: CategoryDef?
    let income: Bool
    @State private var name = ""

    private var valid: Bool { Store.isClean(name) }

    var body: some View {
        NavigationStack {
            ZStack {
                AppBackground()
                VStack(alignment: .leading, spacing: 16) {
                    TextField("Category name", text: $name)
                        .padding(16)
                        .glass(20)
                    Text(valid || name.isEmpty ? "Letters and numbers only, 2 to 24 characters." : "Remove symbols such as & or brackets.")
                        .font(.footnote)
                        .foregroundStyle(valid || name.isEmpty ? Color.secondary : Theme.expense)
                    PrimaryButton(title: "Save", enabled: valid) { save() }
                    Spacer()
                }
                .padding(20)
            }
            .navigationTitle(existing == nil ? "New category" : "Rename")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } } }
            .onAppear { name = existing?.name ?? "" }
        }
        .presentationDetents([.medium])
    }

    private func save() {
        let clean = name.trimmingCharacters(in: .whitespaces)
        if let e = existing, let i = store.categories.firstIndex(where: { $0.code == e.code }) {
            store.categories[i].name = clean
        } else {
            store.categories.append(CategoryDef(code: store.makeCode(for: clean), name: clean, income: income))
        }
        dismiss()
    }
}
