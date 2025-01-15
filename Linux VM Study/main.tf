# Configuração do Provider Azure
provider "azurerm" {
  features {}

  # Adicione estas variáveis de autenticação
  subscription_id = "id da sua subscrição"
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-study"
  location = "East US"
}

resource "azurerm_virtual_network" "vnet" {
  name                = "vnet-study"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_subnet" "subnet" {
  name                 = "subnet-study"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}


resource "azurerm_subnet" "subnet" {
  name                 = "subnet-study2"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.2.0/24"]
}
resource "random_integer" "suffix" {
  min = 100000
  max = 999999
}

# Módulo de Armazenamento
module "storage" {
  source              = "./modules/storage"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
}

# Módulo de VM
module "vm" {
  source               = "./modules/vm"
  resource_group_name  = azurerm_resource_group.rg.name
  location             = azurerm_resource_group.rg.location
  vm_name              = "vm-study"
  subnet_id            = azurerm_subnet.subnet.id
  ssh_public_key_path  = "~/.ssh/id_rsa.pub" # Caminho para sua chave pública
  container_name       = module.storage.container_name
  storage_account_name = module.storage.storage_account_name
  storage_account_key  = module.storage.storage_account_key
}

