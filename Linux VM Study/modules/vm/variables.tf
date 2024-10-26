variable "resource_group_name" {
  description = "The name of the resource group."
  type        = string
}

variable "location" {
  description = "The location for the virtual machine."
  type        = string
}

variable "vm_name" {
  description = "The name of the virtual machine."
  type        = string
}

variable "subnet_id" {
  description = "The ID of the subnet."
  type        = string
}

variable "ssh_public_key_path" {
  description = "The path to the SSH public key."
  type        = string
}

variable "container_name" {
  description = "The name of the storage container."
  type        = string
}

variable "storage_account_key" {
  description = "The access key of the storage account."
  type        = string
}

variable "storage_account_name" {
  description = "The name of the storage account."
  type        = string
}
