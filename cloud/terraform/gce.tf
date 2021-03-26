resource "random_id" "instance_id" {
  byte_length = 3
}

resource "google_compute_address" "static_ip_address" {
  name = "static-ip-address"
}

resource "google_compute_instance" "gcp_lab_instance" {
  name         = "vm-tf-${random_id.instance_id.hex}"
  machine_type = var.machine_type
  zone         = var.zone

  labels       = {
    "env" = var.compute_instance_environment
  }
  
  attached_disk {
    source      = google_compute_disk.default_persistent_disk.name
    device_name = google_compute_disk.default_persistent_disk.name
  }
  
  boot_disk {
    initialize_params {
      image = var.ubuntu_image
    }
  }
  
  allow_stopping_for_update = true
  
  //metadata = {
  //  MONGO_ATLAS_STRING = "${var.MONGO_ATLAS_STRING}"
  //  JWT_KEY = "${var.JWT_KEY}"
  //}

  metadata_startup_script = file(var.startup_script)

  network_interface {
    network = "default"

    access_config {
      // Include this section to give the VM an external ip address
      nat_ip = google_compute_address.static_ip_address.address
    }
  }

  // Apply the firewall rule to allow external IPs to access this instance
  tags = ["http-server", "https-server"]
}
output "ip" {
  value = google_compute_instance.gcp_lab_instance.network_interface.0.access_config.0.nat_ip
}
resource "google_compute_disk" "default_persistent_disk" {
  name                      = var.ssd_name
  type                      = "pd-ssd"
  size                      = "10"
  zone                      = var.zone
  physical_block_size_bytes = 4096
}
