# Configure the Hetzner Cloud Provider
terraform {
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.45"
    }
  }
}
provider "hcloud" {
  token   = var.hcloud_token
}

resource "hcloud_ssh_key" "default" {
  name       = "hetzner_key"
  public_key = file("~/.ssh/tf_hetzner.pub")
}

resource "hcloud_server" "openwebui" {
  name        = "open-webui-server"
  image       = var.os_type
  server_type = var.server_type
  location    = var.location
  ssh_keys    = [hcloud_ssh_key.default.id]
  labels = {
    type = "openwebui"
  }

  user_data = templatefile("${path.module}/user_data.yml.tmpl", {
    ssh_public_key = file("~/.ssh/tf_hetzner.pub")
    tailscale_auth_key = var.tailscale_auth_key
  })


  public_net {
    ipv4_enabled = true
    ipv6_enabled = false
  }
}

output "server_ip" {
  value = hcloud_server.openwebui
}

