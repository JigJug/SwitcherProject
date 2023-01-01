
import { autoUpdater, dialog } from 'electron';

// Updater process
export function startAutoUpdater(){
  // Tell the updater where to look for updates
  autoUpdater.setFeedURL({ url: 'Z:/Operations Department/Test Development/Change Database App/Updates/Win64' });
  // Display a success message if it updates successfully
  autoUpdater.addListener('update-downloaded', (event, releaseNotes, releaseName) => {
    dialog.showMessageBox({ 'message': `The release ${releaseName} has been downloaded and will be used next time this programme is opened.` });
  });
  // Display an error message if the update fails
  autoUpdater.addListener('error', (error) => { dialog.showMessageBox({ 'message': 'Auto updater error: ' + error }); });
  autoUpdater.on('update-available', function () {
    dialog.showMessageBox({ 'message': 'An updated version of this software has been found and will now download in the background.\n\nYou will be informed when the download has finished: please do not close the software until it is done.' });
  });
  // Tell squirrel to check for updates
  autoUpdater.checkForUpdates();
};