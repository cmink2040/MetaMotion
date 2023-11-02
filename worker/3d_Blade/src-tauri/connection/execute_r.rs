extern crate reqwest;
extern crate regex;
extern crate notify;
extern crate notify_debouncer_full;


use std::path::Path;
use notify_debouncer_full::{notify::*, new_debouncer, DebounceEventResult, DebouncedEvent};
use std::process::Command;
use reqwest::Client;
use regex::Regex;




//use std::sync::mpsc::channel;
use notify::{Watcher, RecursiveMode, Error};
use serde::Serialize;

#[derive(Serialize)]
struct Data {
    title: String,
    progress: f32,
    status: String,
}

fn watch_dir (
    directory: &str,
    name: &str,
    start: i32,
    end: i32,
    url: &str,
) ->
Result<String>
{
    let mut watcher = new_debouncer(std::time::Duration::from_secs(2),
                                    None, |result: DebounceEventResult| {
            match result {
                Ok(event) => {
                    if let DebouncedEvent::Create(path) = event {
                        if let Some(file_name) = path.file_name() {
                            if let Some(name) = file_name.to_str() {
                                println!("File created: {}", name);
                                let digit_pattern = Regex::new(r"\d+").unwrap();

                                let cf: Vec<_> = digit_pattern.find_iter(name)
                                    .map(|mat| mat.as_str().parse::<i32>().unwrap())
                                    .collect();


                                // Assuming currentFrame is meant to be cf
                                let current_frame = cf.iter().map(|&x| x.to_string()).collect::<Vec<_>>().join("");

                                //current_frame to int

                                let current_frames = current_frame.parse::<i32>().unwrap();

                                let a = end as f32;
                                let b = start as f32;
                                let c = a-b + 1.0;

                                let cf = current_frames as f32;

                                let progress = (cf+1.0)/c;
                                let mut frames_made = "IN_PROGRESS";

                                let payload = Data {
                                    title: name.to_string(),
                                    progress,
                                    status: frames_made.to_string(),
                                };



                                let body = serde_json::to_string(&payload)?;

                                if current_frames == end {
                                    frames_made = "COMPLETE"
                                }


                                let response =  Client::new();
                                let res = response.patch(url)
                                    .header(reqwest::header::CONTENT_TYPE, "application/json")
                                    .body(body)
                                    .send()?;
                                println!("Response: {:?}", res);
                            }



                        }
                    }
                }
                Err(e) => {
                    eprintln!("Error: {:?}", e);
                }
            }
        })?;

    // Add a directory to watch
    watcher.watcher().watch(Path::new(directory), RecursiveMode::Recursive).unwrap();
    watcher.cache().add_root(Path::new(directory), RecursiveMode::Recursive);


     Ok(("Watching directory...".to_string()))

}



fn run_command_blender(
    file: &str,
    output_type: &str,
    output_path: &str,
    start_frame: &i32,
    end_frame: &i32,

) -> String{
    let b = "-b";
    let e = "-E";
    let f = "-F";
    let x = "-x";
    let cycles = "CYCLES";
    let sf= start_frame.to_string();
    let ef = end_frame.to_string();
    let one = "1";
    let s = "-s";
    let a = "-a";
    let fls = file;
    let outpt = output_type;
    let outptpth = output_path;

    let output = Command::new("blender")
        .arg(b)
        .arg(fls)
        .arg(e)
        .arg(cycles)
        .arg(f)
        .arg(outpt)
        .arg(x)
        .arg(one)
        .arg(outptpth)
        .arg(s)
        .arg(sf)
        .arg(a)
        .output();
/*
        let outputs = Command::new("blender")
        .args(
            &[
                b,
                fls,
                e,
                cycles,
                f,
                outpt,
                x,
                one,
                outptpth,
                s,
                sf,
                a,
            ]
        )
        .output();
     */


    match output {
        Ok(output) => {
            if output.status.success() {
                format!("Blender is available.")
            } else {
                format!("Blender is unavailable.\n Error: {}", output.status)
            }
        }
        Err(e) => {
            format!("Error executing command: {}", e)
        }
    }

}