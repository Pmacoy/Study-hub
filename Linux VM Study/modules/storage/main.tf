resource "random_integer" "suffix" {
  min = 100000
  max = 999999
}

resource "azurerm_storage_account" "storage_account" {
  name                     = "storagedevops${random_integer.suffix.result}"
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "dvops_container" {
  name                  = "dvops"
  storage_account_name  = azurerm_storage_account.storage_account.name
  container_access_type = "private"

  lifecycle {
    prevent_destroy = true
  }
}
