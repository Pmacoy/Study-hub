output "storage_account_key" {
  value = azurerm_storage_account.storage_account.primary_access_key
}

output "storage_account_name" {
  value = azurerm_storage_account.storage_account.name
}

output "container_name" {
  value = azurerm_storage_container.dvops_container.name
}
