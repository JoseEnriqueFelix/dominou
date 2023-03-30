import java.util.Scanner;
import java.util.ArrayList;


public class GeneradorDeNumeros {

    static double calcmedia(ArrayList<Integer> lista){
        int suma=0;
        for (int i=0;i<lista.size(); i++){
            suma=suma + lista.get(i);
        }
        double media=suma/lista.size();
        return media;
    }

    static double calcvarianza(ArrayList<Integer> lista, double media){
        double suma=0;
        for (int i=0; i<lista.size(); i++){
            suma+= (lista.get(i) - media)*(lista.get(i) - media);
        }
        double varianza=suma/lista.size();
        return varianza;
    }

    static void tabla(int semilla){
        boolean b=true;
        ArrayList<Integer> lista = new ArrayList<Integer>();
        int i=0;
        int nuevoNum;
        int cuadrado;
        int numInterno;
        String s1;
        System.out.format("%20s %20s %20s %20s %20s\n", "n", "semilla", "s. al cuadrado", "Numero interno", "Siguiente numero");
        while(b){
            lista.add(semilla);
            cuadrado=semilla*semilla;
            if(cuadrado<100){
                b=false;
                break;
            }
            s1=Integer.toString(cuadrado);
            s1=s1.substring(1, s1.length()-1);
            numInterno=Integer.parseInt(s1);
            if(numInterno>1000){
               s1=Integer.toString(numInterno);
               nuevoNum=Integer.parseInt(s1.substring(0, s1.length()-1));
            }else{
                nuevoNum=numInterno;
            }
            if(numInterno==0){
                b=false;
            }
            System.out.format("%20s %20s %20s %20s %20s\n", i, semilla, cuadrado, numInterno, nuevoNum);
            i++;
            semilla=nuevoNum;
        }    
        double media=calcmedia(lista);
        System.out.println("La media de los numeros generados es: " + media);
        System.out.println("La varianza de los numeros generados es: " + calcvarianza(lista, media));
    }

    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int m=0;
        do{
            System.out.println("Ingrese la semilla:");
            int semilla=sc.nextInt();
            tabla(semilla);
            System.out.println("Ingrese 1 para salir:");
            m=sc.nextInt();
        }while(m!=1);
    }
}
