<?php
// Use in the "Post-Receive URLs" section of your GitHub repo.
if ( $_POST['payload'] ) {
    shell_exec( '/home/ubuntu/newshubapp.co/flockathon-frontend/ && git reset --hard HEAD && git pull origin master' );
}
?>hi