extern crate reqwest;
extern crate zip;
extern crate url;

//use std::fs::File;
use std::fs;
use std::fs::File;



use std::io::{self, Write};
use std::os::unix::fs::PermissionsExt;
use reqwest::Url;

use std::path::{Path};
use zip::write::FileOptions;

use reqwest::Client;
use zip::result::ZipError;

fn  cleanup (
    parent_directory: &str,
    out_dir: &str,
    dwn_dir: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    // Remove subdirectories inside the parent directory
    
    let outdir = format!("{}/{}", parent_directory, out_dir);
    fs::remove_dir_all(&outdir)?;
    println!("Removed directory: {}", out_dir);


    let filedir = format!("{}/{}", parent_directory, dwn_dir);
    fs::remove_dir_all(&filedir)?;
    println!("Removed directory: {}", dwn_dir);
    
    Ok(())
}


fn create_directories(
    parent_directory: &str,
    out_dir: &str,
    dwn_dir: &str,
) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    // Create the parent directory
    // fs::create_dir(parent_directory)?;

    // Vector to store the paths of created directories
    let mut created_paths = Vec::new();

    // Create subdirectories inside the parent directory
    let outdir = format!("{}/{}", parent_directory, out_dir);
    fs::create_dir(&outdir)?;

    let output_path = format!("{}/{}", outdir, "render_");

    created_paths.push(output_path);

    created_paths.push(outdir);


    let filedir = format!("{}/{}", parent_directory, dwn_dir);
    fs::create_dir(&filedir)?;
    created_paths.push(filedir);

    //output_path, outdir, filedir

    Ok(created_paths)
}

// Function to download a file from a URL and save it to a directory

async fn download_file(url: &str, target_directory: &str) -> Result<String,  Box<dyn std::error::Error>> {
    // Parse the URL
    let ul = Url::parse(url)?;

    let file_name = &ul.path_segments()
        .and_then(|segments| segments.last())
        .unwrap_or("downloaded_file");


    // Send the GET request and receive the response
    let response =  Client::new()
                         .get(url)
                            .send()
                            .await?;

    // Get the file name from the URL

    // Build the target file path
    let target_path = Path::new(target_directory).join(file_name);

    // Create a new file in write-only mode
    let mut file = File::create(&target_path)?;

    // Copy the content of the response into the file
    let mut response_bytes = response.text().await?;

    io::copy(&mut response_bytes.as_bytes(), &mut file)?;
   /* while let Some(byte_result) = response_bytes.next().await {
        let byte = byte_result?;
        file.write_all(&[byte])?;
    } */

    println!("File downloaded and saved to {:?}", target_path);

    Ok("response".to_string())
}

/*
fn submit_zip(
    source_folder: &str,
    zip_name: &str,
    backend_url: &str,
) -> Result<String, ZipError>
{
    // Create a zip archive in memory
    let mut zip_buffer = Vec::new();
    let zip_file = fs::File::create(&mut zip_buffer)?;
    let mut zip_writer = zip::ZipWriter::new(zip_file);

    // Iterate through the files in the source folder
    for entry in fs::read_dir(source_folder)? {
        let entry = entry?;
        let file_path = entry.path();

        // Add each file to the zip archive
        let file_name = file_path
            .file_name()
            .and_then(|os_str| os_str.to_str())
            .unwrap_or("file");
        let options = FileOptions::default()
            .compression_method(zip::CompressionMethod::Stored) // Change compression method if needed
            .unix_permissions(entry.metadata()?.permissions().mode()); // Preserve file permissions
        zip_writer.start_file(file_name, options)?;
        let mut file = fs::File::open(file_path)?;
        io::copy(&mut file, &mut zip_writer)?;
    }

    zip_writer.finish()?;

    // Create a reqwest client
    let client = Client::new();

    // Send the zip file to the backend
    let response = client
        .post(backend_url)
        .body(zip_buffer)
        .send()?;


    Ok(format!("Zip file sent to backend. Response: {:?}", response))
}
*/


/*
fn main() {
    let source_folder = "/path/to/source/folder";
    let zip_name = "archive.zip";
    let backend_url = "https://example.com/upload-endpoint";

    if let Err(err) = collect_files_and_create_zip(source_folder, zip_name, backend_url) {
        eprintln!("Error: {}", err);
    }
}


fn main() {
    let url = "https://example.com/path/to/your/file.txt";
    let target_directory = "/path/to/target/directory";

    if let Err(err) = download_file(url, target_directory) {
        eprintln!("Error: {}", err);
    }
}

 */
