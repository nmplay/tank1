package nmplay.tank1;

import java.net.URISyntaxException;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;

/**
 * Tank1 main.
 *
 * @author LightSpeedC
 */
public class Tank1AppMain {

	/**
	 * main.
	 *
	 * @param args
	 *            String...
	 * @throws URISyntaxException
	 *             Exception
	 */
	public static void main(final String... args) throws URISyntaxException {
		System.out.println("hello\n");

		// final Socket socket = IO.socket("http://localhost:3000");
		final Socket socket = IO.socket("https://tank1.herokuapp.com");
		final TankSession session = new TankSession();

		socket.connect();
		socket.on("connect", new Emitter.Listener() {
			public void call(Object... args) {
				System.out.println("connect");
				socket.emit("get messages", "{\"since\":"
						+ session.last_received_at + "}");
			}
		});
		socket.on("response messages", new Emitter.Listener() {
			public void call(Object... args) {
				System.out.println("response messages: " + args[0]);
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
				// session.last_received_at = ...
			}
		});
	}

	static class TankSession {
		int last_received_at = 0;
	}
}
