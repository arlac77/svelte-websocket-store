
post_install() {
	systemctl reload nginx
}

post_upgrade() {
	systemctl reload nginx
}

post_remove() {
	systemctl reload nginx
}
