import SwiftUI
import UniformTypeIdentifiers

struct SettingsView: View {
    @EnvironmentObject var store: Store
    @Environment(\.dismiss) private var dismiss

    @State private var showImporter = false
    @State private var message = ""
    @State private var showMessage = false
    @State private var confirmWipe = false
    @State private var exportURL: URL?

    var body: some View {
        NavigationStack {
            Form {
                Section("Appearance") {
                    Picker("Theme", selection: $store.settings.theme) {
                        Text("System").tag("system")
                        Text("Light").tag("light")
                        Text("Dark").tag("dark")
                    }
                    .pickerStyle(.segmented)
                    Picker("Main currency", selection: $store.settings.currency) {
                        ForEach(["GHS", "USD", "EUR", "GBP", "NGN"], id: \.self) { Text($0).tag($0) }
                    }
                }

                Section("Saving") {
                    HStack {
                        Text("Vault goal")
                        Spacer()
                        TextField("5000", value: $store.settings.vaultGoal, format: .number)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.trailing)
                            .frame(width: 140)
                    }
                    Toggle("Ask me to pay myself first", isOn: $store.settings.askPayFirst)
                    VStack(alignment: .leading) {
                        Text("Usual amount to set aside: \(Int(store.settings.payFirstPercent))%")
                        Slider(value: $store.settings.payFirstPercent, in: 0...50, step: 1)
                    }
                }

                Section("Organise") {
                    NavigationLink("Categories") { CategoriesView() }
                }

                Section("Your data") {
                    Button("Import a CSV file") { showImporter = true }
                    if let url = exportURL {
                        ShareLink("Export as CSV", item: url)
                    }
                    Button("Erase everything", role: .destructive) { confirmWipe = true }
                    Text("Everything stays on this phone. Nothing is uploaded anywhere.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }

                Section("About") {
                    HStack {
                        Text("Transactions")
                        Spacer()
                        Text("\(store.txns.count)").foregroundStyle(.secondary)
                    }
                    HStack {
                        Text("Version")
                        Spacer()
                        Text("1.0").foregroundStyle(.secondary)
                    }
                }
            }
            .scrollContentBackground(.hidden)
            .background(AppBackground())
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .confirmationAction) { Button("Done") { dismiss() } } }
            .onAppear { exportURL = makeExport() }
            .fileImporter(isPresented: $showImporter,
                          allowedContentTypes: [.commaSeparatedText, .plainText, .text],
                          allowsMultipleSelection: false) { result in
                handleImport(result)
            }
            .alert(message, isPresented: $showMessage) { Button("OK", role: .cancel) {} }
            .confirmationDialog("Erase all wallets and transactions on this phone?", isPresented: $confirmWipe, titleVisibility: .visible) {
                Button("Erase everything", role: .destructive) { store.wipe() }
                Button("Cancel", role: .cancel) {}
            }
        }
    }

    private func makeExport() -> URL? {
        let url = FileManager.default.temporaryDirectory.appendingPathComponent("MoneyTrack-export.csv")
        do {
            try store.exportCSV().write(to: url, atomically: true, encoding: .utf8)
            return url
        } catch {
            return nil
        }
    }

    private func handleImport(_ result: Result<[URL], Error>) {
        guard case .success(let urls) = result, let url = urls.first else { return }
        let access = url.startAccessingSecurityScopedResource()
        defer { if access { url.stopAccessingSecurityScopedResource() } }
        if let data = try? Data(contentsOf: url), let text = String(data: data, encoding: .utf8) {
            let r = store.importCSV(text)
            message = r.added == 0 && r.skipped == 0
                ? "That file does not look like a MoneyTrack or Wallet export."
                : "Added \(r.added) transactions, skipped \(r.skipped) duplicates or unreadable rows."
        } else {
            message = "Could not read that file."
        }
        exportURL = makeExport()
        showMessage = true
    }
}
