package br.com.techsolutions;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Ponto de entrada do backend Java: sobe o servidor na porta 8080
@SpringBootApplication
public class TechSolutionsApplication {
    public static void main(String[] args) {
        // No Windows, o Java cria um socket interno na pasta TEMP do usuário; se o nome do usuário
        // tiver espaço, o servidor não sobe ("Unable to establish loopback connection").
        // Usamos a pasta pública C:\Users\Public, que existe em todo Windows e não tem espaço.
        if (System.getProperty("os.name").startsWith("Windows")
                && System.getProperty("jdk.net.unixdomain.tmpdir") == null
                && System.getenv("PUBLIC") != null) {
            System.setProperty("jdk.net.unixdomain.tmpdir", System.getenv("PUBLIC"));
        }
        SpringApplication.run(TechSolutionsApplication.class, args);
    }
}
