use std::process::Command;

#[path = "../hardware_monitoring/cpu.rs"] mod cpu;

#[path = "../hardware_monitoring/gpu.rs"] mod gpu;

#[path = "../hardware_monitoring/ram.rs"] mod ram;

#[path = "../hardware_monitoring/system.rs"] mod system;


#[path = "../connection/ExecuteR.rs"] mod ExecuteR;

#[path = "../connection/File_Manager.rs"] mod File_Manager;

#[path = "../connection/Redis_Connector.rs"] mod Redis_Connector;



fn fetch_ram_info() -> Vec<String> {
    ram::fetch_ram_info()
}



fn fetch_gpu_info() -> Vec<String> {
    gpu::get_gpu_info()
}


fn fetch_cpu_info() ->  ( Vec<Vec<f32>>, Vec<Vec<String>>, Vec<Vec<u64>>) {
    let mut cpu_floats: ( Vec<Vec<f32>>, Vec<Vec<String>>, Vec<Vec<u64>>) = cpu::fetch_cpu_info();


    cpu_floats
}

fn fetch_system_info() -> Vec<String> {
    system::fetch_system_info()
}


fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn join_queue() -> String {
    format!("Joining queue")
}

fn will_blender_run() -> String{
    let output = Command::new("blender")
        .arg("--help")
        .output();

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


fn main() {
    println!("{}", will_blender_run())
}


