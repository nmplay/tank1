package nmplay.tank1;

import java.net.URISyntaxException;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;

public class Tank1AppMain {

	/**
	 * main.
	 *
	 * @param args
	 * @throws URISyntaxException
	 */
	public static void main(String[] args) throws URISyntaxException {
		System.out.println("hello\n");
		// final Socket socket = IO.socket("http://localhost:3000");
		final Socket socket = IO.socket("https://tank1.herokuapp.com");
		socket.connect();
		socket.on("connect", new Emitter.Listener() {
			public void call(Object... args) {
				System.out.println("connect");
				socket.emit("first", "{\"first\":\"message from client.java\"}");
			}
		});
		socket.on("first", new Emitter.Listener() {
			public void call(Object... args) {
				System.out.println("first: " + args[0]);
				socket.emit("other event",
						"{\"other\":\"event from client.java\"}");
			}
		});
		socket.on("disconnect", new Emitter.Listener() {
			public void call(Object... args) {
				System.out.println("disconnect");
			}
		});
		socket.on("message", new Emitter.Listener() {
			public void call(Object... args) {
				System.out.println("message: " + args[0]);
			}
		});
	}
}
